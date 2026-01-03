export const cleanThreadsPost = (items: any[]): string[] => {
  if (!items || !Array.isArray(items)) return [];

  return items
    .map((item) => {
      try {
        if (item?.caption?.text) {
          return item.caption.text;
        }

        if (item?.thread_items?.[0]?.post?.caption?.text) {
          return item.thread_items[0].post.caption.text;
        }

        if (item?.description) {
          return item.description;
        }

        return "";
      } catch (e) {
        return "";
      }
    }).filter((text) => text && typeof text === "string" && text.trim().length > 0);
};