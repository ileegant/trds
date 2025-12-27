"use client";

import Snowfall from "react-snowfall";

export function Snow() {
  return (
    <div className="fixed inset-0 pointer-events-none z-10 w-full h-[25vh] [mask-image:linear-gradient(to_bottom,black_20%,transparent_100%)]">
      <Snowfall
        snowflakeCount={20}
        color="#ffffff"
        radius={[0.5, 3.0]}
        speed={[0.5, 3.0]}
        wind={[-0.5, 2.0]}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
