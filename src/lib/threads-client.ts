import { ThreadsAPI } from "threads-api";

const threadsClient = new ThreadsAPI({
  deviceID: process.env.THREADS_DEVICE_ID,
});

export const THREADS_ERRORS = {
  NOT_FOUND: "USER_NOT_FOUND",
  PRIVATE_OR_EMPTY: "PRIVATE_PROFILE",
  NO_REPLIES: "NO_REPLIES",
  PROFILE_PARSE_ERROR: "PROFILE_PARSE_ERROR",
};

export async function fetchThreadsUserData(username: string) {
  const userId = await threadsClient.getUserIDfromUsername(username);

  if (!userId) {
    throw new Error(THREADS_ERRORS.NOT_FOUND);
  }

  const [threads, replies] = await Promise.all([
    threadsClient.getUserProfileThreads(userId),
    threadsClient.getUserProfileReplies(userId),
  ]);

  if (!threads || threads.length === 0) {
    throw new Error(THREADS_ERRORS.PRIVATE_OR_EMPTY);
  }

  if (!replies || replies.length === 0) {
    throw new Error(THREADS_ERRORS.NO_REPLIES);
  }

  const profile = threads[0]?.thread_items?.[0]?.post?.user;

  if (!profile) {
    console.warn(
      `[Threads API] Failed to extract profile for user: ${username}`
    );
    throw new Error(THREADS_ERRORS.PROFILE_PARSE_ERROR);
  }

  return {
    profile,
    threads,
    replies,
  };
}
