import { NextResponse } from "next/server";
import { fetchThreadsUserData } from "@/lib/threads-client";
import { fetchImageToBase64 } from "@/lib/image-utils";

const ERROR_MAPPING: Record<string, { message: string; status: number }> = {
  USER_NOT_FOUND: { message: "User not found", status: 404 },
  PRIVATE_PROFILE: { message: "Private profile", status: 403 },
  NO_REPLIES: { message: "No replies", status: 422 },
};

export async function POST(req: Request) {
  try {
    const { username } = await req.json();

    if (!username) {
      return NextResponse.json(
        { error: "Username necessary" },
        { status: 400 }
      );
    }

    const {
      profile: profile,
      threads: threads,
      replies: replies,
    } = await fetchThreadsUserData(username);

    const avatarBase64 = await fetchImageToBase64(profile.profile_pic_url);

    return NextResponse.json({
      user: {
        username: profile.username,
        avatar: avatarBase64,
      },
      posts: threads,
      replies: replies,
    });
  } catch (error: any) {
    const knownError = ERROR_MAPPING[error.message];

    if (knownError) {
      return NextResponse.json(
        { error: knownError.message },
        { status: knownError.status }
      );
    }

    console.error("[Threads API Error]:", error);

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
