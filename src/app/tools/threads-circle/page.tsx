"use client";

import { useState } from "react";
import { AtSign, Users } from "lucide-react";
import ThreadsCanvasGenerator from "@/components/ui/ThreadsCanvasGenerator"; // Ваш компонент з попереднього кроку
import { CatSupportModal } from "@/components/ui/CatSupportModal"; // Припускаю, що це у вас є
import { ErrorAlert } from "@/components/ui/ErrorAlert";

// --- CONSTANTS ---
// УВАГА: У реальному проєкті ці URL мають бути динамічними або йти через ваш бекенд,
// який перетворює username -> id. Тут залишено хардкод з вашого прикладу.
const POSTS_URL =
  "https://api.twitterpicker.com/threads/user/posts?minimal=threadscircle&id=9Mtq%2Ba%2FFaFw13kM3cJ14Mw.Jr6XKKZl%2FcOdRS66yzGX6g";
const REPLIES_URL =
  "https://api.twitterpicker.com/threads/user/replies?minimal=threadscircle&id=9Mtq%2Ba%2FFaFw13kM3cJ14Mw.Jr6XKKZl%2FcOdRS66yzGX6g";

export default function ThreadsCirclePage() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Data State
  const [owner, setOwner] = useState<any>(null);
  const [tier1, setTier1] = useState<any[]>([]);
  const [tier2, setTier2] = useState<any[]>([]);
  const [dataReady, setDataReady] = useState(false);

  // --- LOGIC HELPERS ---
  const showError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(""), 4000);
  };

  const extractAllUsersRecursive = (obj: any): any[] => {
    let foundUsers: any[] = [];
    const traverse = (current: any) => {
      if (!current || typeof current !== "object") return;
      if (!Array.isArray(current) && current.user) {
        foundUsers.push(current.user);
      }
      Object.values(current).forEach((value) => {
        if (typeof value === "object") traverse(value);
      });
    };
    traverse(obj);
    return foundUsers;
  };

  const getUniqueUsers = (users: any[]) => {
    const map = new Map();
    users.forEach((u) => {
      if (u && u.pk) map.set(u.pk, u);
    });
    return Array.from(map.values());
  };

  // --- MAIN HANDLER ---
  const handleGenerate = async () => {
    const cleanNick = username.replace("@", "").trim();
    if (!cleanNick)
      return showError("Введи хоч щось, екстрасенси у відпустці.");

    setLoading(true);
    setDataReady(false);
    setOwner(null);
    setTier1([]);
    setTier2([]);

    try {
      // Імітуємо пошук ID користувача (бо URL поки захардкожені)
      // У реальності тут був би запит: const id = await getIdByUsername(cleanNick);

      const [postsRes, repliesRes] = await Promise.all([
        fetch(POSTS_URL),
        fetch(REPLIES_URL),
      ]);

      if (!postsRes.ok || !repliesRes.ok) throw new Error("API Error");

      const postsJson = await postsRes.json();
      const repliesJson = await repliesRes.json();

      // 1. Find Owner
      let foundOwner = null;
      if (Array.isArray(postsJson) && postsJson.length > 0) {
        if (postsJson[0].thread_items?.[0]?.post?.user) {
          foundOwner = postsJson[0].thread_items[0].post.user;
        } else if (postsJson[0].user) {
          foundOwner = postsJson[0].user;
        }
      }
      if (!foundOwner) {
        const temp = extractAllUsersRecursive(postsJson);
        if (temp.length > 0) foundOwner = temp[0];
      }

      // Якщо API хардкодне, ми можемо підмінити ім'я власника на введене юзером для краси,
      // але залишаємо як є для чесності даних.
      setOwner(foundOwner);

      // 2. Extract Others
      const rawPostsUsers = extractAllUsersRecursive(postsJson);
      const rawRepliesUsers = extractAllUsersRecursive(repliesJson);

      let uniquePostsUsers = getUniqueUsers(rawPostsUsers);
      let uniqueRepliesUsers = getUniqueUsers(rawRepliesUsers);

      // 3. Filter Owner out
      if (foundOwner) {
        const ownerId = foundOwner.pk;
        uniquePostsUsers = uniquePostsUsers.filter((u) => u.pk !== ownerId);
        uniqueRepliesUsers = uniqueRepliesUsers.filter((u) => u.pk !== ownerId);
      }

      // 4. Distribute Tiers
      const TIER_1_LIMIT = 6;
      const tempTier1: any[] = [];
      const tempTier2: any[] = [];
      const usedIds = new Set();

      // From Posts
      uniquePostsUsers.forEach((user) => {
        if (tempTier1.length < TIER_1_LIMIT) {
          tempTier1.push(user);
          usedIds.add(user.pk);
        } else {
          tempTier2.push(user);
          usedIds.add(user.pk);
        }
      });

      // From Replies
      uniqueRepliesUsers.forEach((user) => {
        if (usedIds.has(user.pk)) return;
        if (tempTier1.length < TIER_1_LIMIT) {
          tempTier1.push(user);
          usedIds.add(user.pk);
        } else {
          tempTier2.push(user);
          usedIds.add(user.pk);
        }
      });

      setTier1(tempTier1);
      setTier2(tempTier2);
      setDataReady(true);
    } catch (err: any) {
      console.error(err);
      showError(
        "Щось пішло не так. Можливо, профіль закритий або API втомився."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-neutral-950 text-white selection:bg-green-500/30 overflow-x-hidden font-mono">
      {/* --- ERROR TOAST --- */}
      {errorMsg && <ErrorAlert message={errorMsg} />}

      {/* --- LOADING MODAL --- */}
      {loading && <CatSupportModal />}

      <main className="container mx-auto py-12 max-w-3xl min-h-screen flex flex-col items-center relative z-10 px-4">
        {!dataReady ? (
          /* --- INPUT MODE --- */
          <div className="w-full flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-8 inline-flex items-center justify-center p-4 bg-neutral-900 border border-neutral-800 rounded-full shadow-2xl">
              <Users className="w-10 h-10 text-green-400" />
            </div>

            <h1 className="font-black text-4xl md:text-7xl uppercase tracking-tighter text-white mb-6 leading-none">
              Твоє Тредс{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
                Оточення
              </span>
            </h1>

            <p className="text-neutral-400 text-[10px] md:text-sm mb-12 max-w-lg font-mono uppercase tracking-wider leading-relaxed">
              Скажи мені, хто твій друг, і я скажу, хто ти. <br />
              Генеруємо візуалізацію твого соціального бульбашки.
            </p>

            <div className="w-full max-w-md space-y-6">
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-green-400 transition-colors">
                  <AtSign className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                  className="w-full pl-12 pr-4 py-4 bg-black border-2 border-neutral-800 text-white placeholder-neutral-700 focus:outline-none focus:border-green-500 transition-all text-lg font-bold uppercase font-mono shadow-[4px_4px_0px_0px_rgba(38,38,38,1)] focus:shadow-[4px_4px_0px_0px_#22c55e]"
                  placeholder="ВВЕДИ НІКНЕЙМ"
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading || !username.trim()}
                className="w-full py-4 bg-white text-black border-2 border-white font-black uppercase tracking-widest text-sm shadow-[4px_4px_0px_0px_#22c55e] hover:bg-green-400 hover:border-green-400 hover:shadow-[2px_2px_0px_0px_black] hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span>Аналізувати зв'язки</span>
              </button>
            </div>
          </div>
        ) : (
          /* --- RESULT MODE --- */
          <div className="w-full flex flex-col items-center animate-in fade-in duration-500">
            {/* 5. CANVAS GENERATOR */}
            <div className="w-full flex justify-center pb-20">
              {owner && (
                <ThreadsCanvasGenerator
                  owner={owner}
                  tier1={tier1}
                  tier2={tier2}
                />
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
