import { ARCHETYPES_LIST, SUPERPOWERS_LIST, ROASTS_LIST } from "@/data/content";
import { calculateUserSeed } from "./utils";

export interface VibeStats {
  toxicity: number;
  ego: number;
  boringness: number;
}

export interface VibeResult {
  archetype: string;
  superpower: string;
  stats: VibeStats;
  roast: string;
  avatar?: string | null;
}

export const generateVibe = (
  username: string,
  posts: string[] = [],
  avatar?: string | null
): VibeResult => {
  const totalContentLength = posts.join("").length;
  const seed = calculateUserSeed(username, totalContentLength);

  return {
    archetype: ARCHETYPES_LIST[seed % ARCHETYPES_LIST.length],
    superpower: SUPERPOWERS_LIST[seed % SUPERPOWERS_LIST.length],
    stats: {
      toxicity: (seed * 13) % 100,
      ego: (seed * 7) % 100,
      boringness: (seed * 23) % 100,
    },
    roast: ROASTS_LIST[seed % ROASTS_LIST.length],
    avatar: avatar,
  };
};
