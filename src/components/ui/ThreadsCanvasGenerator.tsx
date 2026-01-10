"use client";

import { useRef, useState, useEffect } from "react";
import { Palette, RefreshCcw } from "lucide-react";
import { useSmartShare } from "@/hooks/useSmartShare";
import { ActionButtons } from "../tools/ActionButtons";

interface User {
  pk: string;
  username: string;
  profile_pic_url: string;
}

interface ThreadsCircleProps {
  owner: User;
  tier1: User[];
  tier2: User[];
}

export default function ThreadsCanvasGenerator({
  owner,
  tier1,
  tier2,
}: ThreadsCircleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [bgColor, setBgColor] = useState("#d8b4fe");
  const [isDrawing, setIsDrawing] = useState(true);

  const visualTier2 = tier2.slice(0, 14);

  const getProxyUrl = (url: string) =>
    `/api/proxy-image?url=${encodeURIComponent(url)}`;

  // Завантажувач зображень (Promise wrapper)
  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = src;
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(e);
    });
  };

  // Функція малювання круглої аватарки
  const drawAvatar = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    x: number,
    y: number,
    size: number
  ) => {
    ctx.save();

    // 1. Переміщуємо контекст у центр майбутньої аватарки для обертання
    ctx.translate(x, y);

    // 2. Малюємо тінь
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 4;

    // 3. Малюємо коло (маску)
    ctx.beginPath();
    // Малюємо від 0,0 бо ми вже зробили translate(x,y)
    ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
    ctx.closePath();

    // 4. Обрізаємо все, що виходить за коло
    ctx.save(); // зберігаємо стан перед кліпом
    ctx.clip();
    // Малюємо картинку (центруємо її відносно 0,0)
    ctx.drawImage(img, -size / 2, -size / 2, size, size);
    ctx.restore(); // відновлюємо кліп

    // 5. Малюємо обводку (Border)
    ctx.shadowColor = "transparent"; // Прибираємо тінь для рамки

    ctx.restore(); // Повертаємо контекст на місце (скасовуємо translate/rotate)
  };

  // --- 2. ГОЛОВНА ЛОГІКА МАЛЮВАННЯ ---
  useEffect(() => {
    let isMounted = true;

    const renderCanvas = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      setIsDrawing(true);

      // Налаштування розмірів (Висока якість)
      const size = 1200; // Реальний розмір канвасу (HD)
      canvas.width = size;
      canvas.height = size;
      const centerX = size / 2;
      const centerY = size / 2;

      try {
        // А. Завантажуємо всі картинки паралельно
        const ownerImgPromise = loadImage(getProxyUrl(owner.profile_pic_url));
        const tier1Promises = tier1.map((u) =>
          loadImage(getProxyUrl(u.profile_pic_url))
        );
        const tier2Promises = visualTier2.map((u) =>
          loadImage(getProxyUrl(u.profile_pic_url))
        );

        const [ownerImg, tier1Imgs, tier2Imgs] = await Promise.all([
          ownerImgPromise,
          Promise.all(tier1Promises),
          Promise.all(tier2Promises),
        ]);

        if (!isMounted) return;

        // Б. Малюємо ФОН
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, size, size);

        // Г. Малюємо TIER 2 (Зовнішнє коло)
        const radius2 = size * 0.36; // 36% від розміру
        const avatarSize2 = size * 0.12; // Розмір аватарок

        tier2Imgs.forEach((img, i) => {
          const angle = (i / tier2Imgs.length) * 2 * Math.PI - Math.PI / 2;
          const x = centerX + radius2 * Math.cos(angle);
          const y = centerY + radius2 * Math.sin(angle);

          drawAvatar(ctx, img, x, y, avatarSize2);
        });

        // Д. Малюємо TIER 1 (Середнє коло)
        const radius1 = size * 0.2; // 20% від розміру
        const avatarSize1 = size * 0.16;

        tier1Imgs.forEach((img, i) => {
          const angle = (i / tier1Imgs.length) * 2 * Math.PI - Math.PI / 2;
          const x = centerX + radius1 * Math.cos(angle);
          const y = centerY + radius1 * Math.sin(angle);

          // Tier 1 зазвичай не крутять, але якщо хочеш - додай rotateDeg
          drawAvatar(ctx, img, x, y, avatarSize1);
        });

        // Е. Малюємо ВЛАСНИКА (Центр)
        const ownerSize = size * 0.2;
        drawAvatar(ctx, ownerImg, centerX, centerY, ownerSize);
      } catch (error) {
        console.error("Failed to load images", error);
      } finally {
        if (isMounted) setIsDrawing(false);
      }
    };

    renderCanvas();

    return () => {
      isMounted = false;
    };
  }, [owner, tier1, tier2, bgColor]); // Перемальовуємо, якщо змінились дані або колір

  const { handleShare, isSharing } = useSmartShare({
    ref: canvasRef,
    username: owner.username,
    filePrefix: "threads-circle",
    shareData: {
      title: "Моє оточення в Threads саме краще",
      text: "Моє оточення в Threads саме краще✨\nЗробити собі: https://trds.fun/tools/threads-circle\nХочеш очистити карму? Скинь коту на елітну рибу!🐟👹",
    },
  });

  const colors = ["#1e1e1e", "#ffffff", "#fca5a5", "#86efac", "#fcd34d"];

  return (
    <div className="flex flex-col items-center w-full py-8 px-4">
      {/* --- КОНТРОЛЕРИ --- */}
      <div className="flex gap-2 bg-neutral-800 p-2 rounded-full border border-neutral-700 overflow-x-auto max-w-full mb-8 shadow-lg scrollbar-hide">
        <Palette className="w-5 h-5 text-neutral-400 ml-2 mr-1 self-center flex-shrink-0" />
        {colors.map((c, i) => (
          <button
            key={i}
            className={`w-8 h-8 rounded-full border border-white/20 hover:scale-110 transition-transform flex-shrink-0 ${
              bgColor === c ? "ring-2 ring-white scale-110" : ""
            }`}
            style={{ background: c }}
            onClick={() => setBgColor(c)}
          />
        ))}
        <input
          type="color"
          value={bgColor}
          onChange={(e) => setBgColor(e.target.value)}
          className="w-8 h-8 rounded-full overflow-hidden cursor-pointer border-none p-0 bg-transparent flex-shrink-0"
        />
      </div>

      {/* --- КАНВАС (Відображається як картинка) --- */}
      <div className="relative w-full max-w-[400px] aspect-square rounded-xl overflow-hidden border border-neutral-800 shadow-2xl bg-neutral-800">
        {/* Спіннер завантаження */}
        {isDrawing && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-50 backdrop-blur-sm">
            <RefreshCcw className="w-8 h-8 text-white animate-spin" />
          </div>
        )}

        {/* Сам елемент канвас */}
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain"
          // Важливо: реальні розміри задаються в JS (1200px),
          // а тут CSS просто масштабує його під екран
        />
      </div>

      <p className="text-neutral-500 text-[10px] mt-4 mb-6 font-mono text-center px-4">
        * Генерація відбувається у реальному часі на вашому пристрої.
      </p>

      {/* --- ACTION BUTTONS --- */}
      <ActionButtons handleShare={handleShare} isSharing={isSharing} />
    </div>
  );
}
