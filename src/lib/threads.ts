import { ThreadsAPI } from "threads-api";

const threadsAPI = new ThreadsAPI({
  deviceID: process.env.THREADS_DEVICE_ID,
});

export async function getThreadsUser(username: string) {
  // 1. Отримуємо ID
  const userID = await threadsAPI.getUserIDfromUsername(username);
  if (!userID) throw new Error("USER_NOT_FOUND");

  // 2. Отримуємо пости
  const userThreads = await threadsAPI.getUserProfileThreads(userID);
  if (!userThreads || userThreads.length === 0) {
    throw new Error("PRIVATE_PROFILE");
  }

  // 3. Отримуємо профіль по крайньому посту
  const userProfile = userThreads[0]?.thread_items?.[0]?.post?.user;

  // 4. Отримуємо реплаї
  const userReplies = await threadsAPI.getUserProfileReplies(userID);

  if (!userReplies || userReplies.length === 0) {
    throw new Error("NO_REPLIES");
  }

  return { userProfile, userThreads, userReplies };
}
