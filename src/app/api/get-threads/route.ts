import { NextResponse } from "next/server";
import { getThreadsUser } from "@/lib/threads";
import { fetchImageToBase64 } from "@/lib/image-utils";

export async function POST(request: Request) {
  try {
    const { username } = await request.json();
    if (!username)
      return NextResponse.json(
        { error: "Нікнейм обов’язковий" },
        { status: 400 }
      );

    const { userProfile, userThreads, userReplies } = await getThreadsUser(
      username
    );

    const avatarBase64 = await fetchImageToBase64(userProfile.profile_pic_url);

    return NextResponse.json({
      user: {
        username: userProfile.username,
        avatar: avatarBase64,
      },
      posts: userThreads,
      replies: userReplies,
    });
  } catch (error: any) {
    const errorMap: Record<string, { msg: string; status: number }> = {
      USER_NOT_FOUND: { msg: "User not found", status: 404 },
      PRIVATE_PROFILE: { msg: "Private profile", status: 403 },
      NO_REPLIES: { msg: "No replies", status: 422 },
    };

    const mappedError = errorMap[error.message];

    if (mappedError) {
      return NextResponse.json(
        { error: mappedError.msg },
        { status: mappedError.status }
      );
    }

    console.error("API Error:", error);
    return NextResponse.json({ error: "Помилка серверу" }, { status: 500 });
  }
}
