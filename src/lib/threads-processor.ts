export interface ThreadsUser {
  pk: string;
  username: string;
  full_name?: string;
  profile_pic_url?: string;
  is_verified?: boolean;
  [key: string]: any;
}

export interface ProcessedThreadsData {
  owner: ThreadsUser | null;
  tier1: ThreadsUser[];
  tier2: ThreadsUser[];
}

const TIER_1_LIMIT = 6;

const extractAllUsersRecursive = (obj: any): ThreadsUser[] => {
  let foundUsers: ThreadsUser[] = [];

  const traverse = (current: any) => {
    if (!current || typeof current !== "object") return;

    if (!Array.isArray(current) && current.user && current.user.pk) {
      foundUsers.push(current.user);
    }

    Object.values(current).forEach((value) => {
      if (typeof value === "object") traverse(value);
    });
  };

  traverse(obj);
  return foundUsers;
};

const getRankedUsers = (
  usersSources: ThreadsUser[][],
  ownerPk: string | null
): ThreadsUser[] => {
  const userMap = new Map<string, { user: ThreadsUser; score: number }>();

  usersSources.forEach((sourceList) => {
    sourceList.forEach((u) => {
      if (!u || !u.pk) return;
      if (ownerPk && u.pk === ownerPk) return;

      if (userMap.has(u.pk)) {
        const entry = userMap.get(u.pk)!;
        entry.score += 1;
      } else {
        userMap.set(u.pk, { user: u, score: 1 });
      }
    });
  });

  return Array.from(userMap.values())
    .sort((a, b) => b.score - a.score)
    .map((item) => item.user);
};

const findOwnerInData = (postsJson: any): ThreadsUser | null => {
  if (Array.isArray(postsJson) && postsJson.length > 0) {
    if (postsJson[0].thread_items?.[0]?.post?.user) {
      return postsJson[0].thread_items[0].post.user;
    }
    if (postsJson[0].user) {
      return postsJson[0].user;
    }
  }
  const temp = extractAllUsersRecursive(postsJson);
  return temp.length > 0 ? temp[0] : null;
};

export const processThreadsContext = async (
  postsJson: any,
  repliesJson: any
): Promise<ProcessedThreadsData> => {
  const owner = findOwnerInData(postsJson);
  const ownerPk = owner ? owner.pk : null;

  const rawPostsUsers = extractAllUsersRecursive(postsJson);
  const rawRepliesUsers = extractAllUsersRecursive(repliesJson);

  const rankedUsers = getRankedUsers(
    [rawPostsUsers, rawRepliesUsers],
    ownerPk
  );

  const tier1 = rankedUsers.slice(0, TIER_1_LIMIT);
  const tier2 = rankedUsers.slice(TIER_1_LIMIT);

  return {
    owner,
    tier1,
    tier2,
  };
};