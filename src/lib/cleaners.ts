export const cleanThreadsPost = (items: any[]): string[] => {
  if (!items || !Array.isArray(items)) return [];

  return items
    .map((item) => {
      try {
        // Варіант 1: Прямий текст (Standard Post object)
        if (item?.caption?.text) {
          return item.caption.text;
        }

        // Варіант 2: Вкладена структура (Thread Item)
        // Часто API віддає масив, де перший елемент - це пост
        if (item?.thread_items?.[0]?.post?.caption?.text) {
          return item.thread_items[0].post.caption.text;
        }

        // Варіант 3: Окремі випадки (SEO description або інше)
        if (item?.description) {
          return item.description;
        }

        return ""; // Якщо тексту немає (наприклад, просто фото без підпису)
      } catch (e) {
        return "";
      }
    })
    // Фільтруємо пусті рядки і null/undefined
    .filter((text) => text && typeof text === "string" && text.trim().length > 0);
};