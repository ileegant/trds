import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    // 1. Робимо запит до Інстаграм/Тредс CDN
    const response = await fetch(url);

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch image" },
        { status: 400 }
      );
    }

    // 2. Отримуємо байт-код картинки (ArrayBuffer)
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 3. Віддаємо картинку назад браузеру з правильними заголовками
    // Браузер буде думати, що ця картинка лежить у тебе на сервері
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable", // Кешуємо надовго
        "Access-Control-Allow-Origin": "*", // Дозволяємо доступ всім
      },
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
