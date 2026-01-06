import { useState, useCallback } from "react";
import { toBlob as htmlToImageBlob } from "html-to-image";

interface ShareOptions<T extends HTMLElement> {
  ref: React.RefObject<T | null>;
  username: string;
  filePrefix?: string;
  shareData: {
    title: string;
    text: string;
    url?: string;
  };
}

export const useSmartShare = <T extends HTMLElement>({
  ref,
  username,
  filePrefix = "threads-app",
  shareData,
}: ShareOptions<T>) => {
  const [isSharing, setIsSharing] = useState(false);

  const generateFilename = useCallback(() => {
    const safeUser = username.replace(/[^a-zA-Z0-9_-]/g, "").trim() || "anon";
    const date = new Date().toISOString().split("T")[0];
    return `${filePrefix}-${safeUser}-${date}.png`;
  }, [username, filePrefix]);

  const handleShare = useCallback(async () => {
    const element = ref.current;
    if (!element || isSharing) return;
    
    setIsSharing(true);

    try {
      let blob: Blob | null = null;

      // 1. ПЕРЕВІРКА: Якщо це Canvas, використовуємо нативний метод (це фіксить проблему чорного екрану)
      if (element instanceof HTMLCanvasElement) {
        blob = await new Promise<Blob | null>((resolve) => {
          // 'image/png' - формат, 1.0 - якість
          element.toBlob((b) => resolve(b), 'image/png', 1.0);
        });
      } else {
        // 2. Якщо це звичайний DIV, використовуємо бібліотеку
        blob = await htmlToImageBlob(element, {
          cacheBust: true,
          // Прибираємо чорний фон, ставимо null або transparent
          backgroundColor: null as unknown as string, 
          skipFonts: true,
          filter: (node) => node.tagName !== "LINK" && node.tagName !== "STYLE",
          pixelRatio: 2, // Для чіткості на Retina
          style: {
            borderRadius: "0px"
          },
        });
      }

      if (!blob) throw new Error("Помилка генерації зображення");

      const fileName = generateFilename();
      const file = new File([blob], fileName, { type: "image/png" });

      const finalShareData: ShareData = {
        title: shareData.title,
        text: shareData.text,
        files: [file],
      };

      // Логіка шарінгу
      if (navigator.share && navigator.canShare && navigator.canShare(finalShareData)) {
        await navigator.share(finalShareData);
      } else {
        // Фоллбек для десктопу (завантаження файлу)
        const link = document.createElement("a");
        link.download = fileName;
        link.href = URL.createObjectURL(blob);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      }
    } catch (err: any) {
      console.error("Share error:", err);
      if (err.name !== "AbortError") {
        // Можна додати toast notification тут
      }
    } finally {
      setIsSharing(false);
    }
  }, [ref, isSharing, generateFilename, shareData]);

  return { handleShare, isSharing };
};