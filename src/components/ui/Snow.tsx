"use client";

import { useEffect, useState } from "react";
import Snowfall from "react-snowfall";

export function Snow() {
  // 👇 Явно вказуємо тип масиву для TypeScript
  const [snowflakeImages, setSnowflakeImages] = useState<HTMLImageElement[]>(
    []
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const image = new Image();

      // Сіра зірочка під Nardo Grey стиль (slate-400)
      const svgString = `
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
          <text x="50%" y="70%" font-size="30" fill="#94a3b8" text-anchor="middle" font-family="monospace" font-weight="bold">*</text>
        </svg>
      `;

      image.src = `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;

      image.onload = () => {
        setSnowflakeImages([image]);
      };
    }
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 w-full h-[20vh] [mask-image:linear-gradient(to_bottom,black_20%,transparent_100%)]">
      <Snowfall
        snowflakeCount={30}
        images={snowflakeImages}
        radius={[7, 14]}
        speed={[0.5, 2.5]}
        wind={[-0.5, 2.0]}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
