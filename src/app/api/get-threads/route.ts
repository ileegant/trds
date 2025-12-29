import { NextResponse } from "next/server";
import { ThreadsAPI } from "threads-api";

// Функція картинки
async function fetchImageToBase64(
  url: string | undefined
): Promise<string | null> {
  if (!url) return null;
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return `data:image/jpeg;base64,${buffer.toString("base64")}`;
  } catch (e) {
    console.error("Image conversion failed:", e);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username } = body;

    if (!username) {
      return NextResponse.json(
        { error: "Нікнейм обов’язковий" },
        { status: 400 }
      );
    }

    const threadsAPI = new ThreadsAPI({
      deviceID: process.env.THREADS_DEVICE_ID,
    });

    // 1. Отримуємо ID
    const userID = await threadsAPI.getUserIDfromUsername(username);

    if (!userID) {
      // 🔴 ВИПАДОК 1: ЮЗЕРА НЕМАЄ
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 2. Отримуємо пости
    const userThreads = await threadsAPI.getUserProfileThreads(userID);

    // 3. Перевірка на ПУСТОТУ або ПРИВАТНІСТЬ
    if (!userThreads || userThreads.length === 0) {
      // Спробуємо дізнатись причину (Приватний чи просто пустий?)
      try {
        const userProfile = await threadsAPI.getUserProfile(userID);

        if (userProfile?.is_private) {
          // 🔴 ВИПАДОК 2: ЗАКРИТИЙ ПРОФІЛЬ
          return NextResponse.json(
            { error: "Private profile" },
            { status: 403 }
          );
        } else {
          // 🔴 ВИПАДОК 3: ПУСТИЙ ПРОФІЛЬ (0 постів)
          return NextResponse.json({ error: "No posts" }, { status: 422 });
        }
      } catch (e) {
        // Якщо не вдалося перевірити профіль, вважаємо його закритим (найчастіший кейс)
        return NextResponse.json(
          { error: "Private or Error" },
          { status: 403 }
        );
      }
    }

    // --- УСПІШНИЙ СЦЕНАРІЙ ---

    // Беремо дані з першого поста
    const authorObj = userThreads[0]?.thread_items?.[0]?.post?.user;

    // Спробуємо безпечно взяти підписників (якщо вийде)
    let followerCount = 0;
    try {
      const profile = await threadsAPI.getUserProfile(userID);
      followerCount = profile?.follower_count || 0;
    } catch (e) {}

    const userData = {
      username: authorObj?.username || username,
      avatarUrl: authorObj?.profile_pic_url,
      followers: followerCount,
    };

    const postsTexts = userThreads
      .map((post: any) => post.thread_items?.[0]?.post?.caption?.text)
      .filter((text: any) => typeof text === "string" && text.length > 0)
      .slice(0, 5);

    const avatarBase64 = await fetchImageToBase64(userData.avatarUrl);

    return NextResponse.json({
      user: {
        username: userData.username,
        avatar: avatarBase64,
        followers: userData.followers,
      },
      posts: postsTexts,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Помилка серверу" }, { status: 500 });
  }
}
