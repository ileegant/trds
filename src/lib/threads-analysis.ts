export interface ThreadUser {
  pk: string;
  username: string;
  full_name?: string;
  profile_pic_url?: string;
  is_verified?: boolean;
  [key: string]: any;
}

export interface UserNetworkData {
  owner: ThreadUser | null;
  topConnections: ThreadUser[];
  otherConnections: ThreadUser[];
}

const TOP_CONNECTIONS_LIMIT = 6;

const extractUsersDeep = (data: any): ThreadUser[] => {
  const foundUsers: ThreadUser[] = [];

  const traverse = (node: any) => {
    if (!node || typeof node !== "object") return;

    if (!Array.isArray(node) && node.user && node.user.pk) {
      foundUsers.push(node.user);
    }

    Object.values(node).forEach((value) => {
      if (typeof value === "object") traverse(value);
    });
  };

  traverse(data);
  return foundUsers;
};

const rankUsersByFrequency = (
  dataSources: ThreadUser[][],
  ownerPk: string | null
): ThreadUser[] => {
  const frequencyMap = new Map<string, { user: ThreadUser; count: number }>();

  dataSources.forEach((sourceList) => {
    sourceList.forEach((u) => {
      if (!u || !u.pk) return;
      if (ownerPk && u.pk === ownerPk) return;

      const current = frequencyMap.get(u.pk);
      if (current) {
        current.count += 1;
      } else {
        frequencyMap.set(u.pk, { user: u, count: 1 });
      }
    });
  });

  return Array.from(frequencyMap.values())
    .sort((a, b) => b.count - a.count)
    .map((item) => item.user);
};

const detectProfileOwner = (postsData: any): ThreadUser | null => {
  if (Array.isArray(postsData) && postsData.length > 0) {
    const firstThreadItem = postsData[0]?.thread_items?.[0];
    if (firstThreadItem?.post?.user) {
      return firstThreadItem.post.user;
    }
    if (postsData[0]?.user) {
      return postsData[0].user;
    }
  }

  const allUsers = extractUsersDeep(postsData);
  return allUsers.length > 0 ? allUsers[0] : null;
};

export const analyzeUserNetwork = async (
  rawPosts: any,
  rawReplies: any
): Promise<UserNetworkData> => {
  const owner = detectProfileOwner(rawPosts);
  const ownerPk = owner ? owner.pk : null;

  const usersFromPosts = extractUsersDeep(rawPosts);
  const usersFromReplies = extractUsersDeep(rawReplies);

  const rankedUsers = rankUsersByFrequency(
    [usersFromPosts, usersFromReplies],
    ownerPk
  );

  const topConnections = rankedUsers.slice(0, TOP_CONNECTIONS_LIMIT);
  const otherConnections = rankedUsers.slice(TOP_CONNECTIONS_LIMIT);

  return {
    owner,
    topConnections,
    otherConnections,
  };
};
