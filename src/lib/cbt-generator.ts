import {
  THREATS,
  CBT_STATUSES,
  postRoasts,
  THREADS_ARCHETYPES,
  SUPERPOWERS_LIST,
} from "@/data/content";
import { calculateUserSeed } from "@/lib/utils";

export interface CBTStats {
  threatLevel: string;
  threatScore: number;
  status: string;
  location: string;
}

export interface EvidenceItem {
  id: number;
  text: string;
  date: string;
  note: string;
}

export interface CBTResult {
  nickname: string;
  archetype: string;
  superpower: string;
  stats: CBTStats;
  roast: string;
  avatar?: string | null;
  evidence: EvidenceItem[];
}

const getThreatData = (seed: number) => {
  const threatScores = Object.keys(THREATS).map(Number);
  const score = threatScores[seed % threatScores.length];
  const label = THREATS[score as keyof typeof THREATS];

  return { score, label };
};

const generateEvidenceList = (
  posts: string[],
  seed: number
): EvidenceItem[] => {
  if (!posts || posts.length === 0) {
    return [
      {
        id: 99,
        text: "Активність прихована. Підозрюваний використовує VPN або режим інкогніто.",
        date: "СЬОГОДНІ",
        note: "НЕВІДОМО",
      },
    ];
  }

  const NOTES = ["ПІДОЗРІЛО", "ЗРАДА", "КРІНЖ", "ІПСО"];

  return posts.slice(0, 3).map((post, i) => ({
    id: i,
    text: post.length > 100 ? post.substring(0, 100) + "..." : post,
    date: new Date(
      Date.now() - i * 86400000 * ((seed % 5) + 1)
    ).toLocaleDateString("uk-UA"),
    note: NOTES[seed % NOTES.length],
  }));
};

export const generateCBT = (
  username: string,
  posts: string[] = [],
  avatar?: string | null,
  location?: string
): CBTResult => {
  const seed = calculateUserSeed(username, posts.length);

  const { score, label } = getThreatData(seed);
  const evidence = generateEvidenceList(posts, seed);

  return {
    nickname: username,
    archetype: THREADS_ARCHETYPES[seed % THREADS_ARCHETYPES.length],
    superpower: SUPERPOWERS_LIST[seed % SUPERPOWERS_LIST.length],
    stats: {
      threatLevel: label,
      threatScore: score,
      status: CBT_STATUSES[seed % CBT_STATUSES.length],
      location: location || "Невідома локація",
    },
    roast: postRoasts[seed % postRoasts.length],
    avatar: avatar,
    evidence: evidence,
  };
};
