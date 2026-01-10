"use client";

import { useState } from "react";
import { Users } from "lucide-react";
import ThreadsCanvasGenerator from "@/components/ui/ThreadsCanvasGenerator";
import { CatSupportModal } from "@/components/ui/CatSupportModal";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { analyzeUserNetwork } from "@/lib/threads-analysis";
import BannedOverlay from "@/components/ui/BannedOverlay";
import { useErrorMessage } from "@/hooks/useErrorMessage";
import { SearchMode } from "@/components/tools/SearchMode";
import { useThreadsProcessor } from "@/hooks/useThreadsProcessor";

export default function ThreadsCirclePage() {
  const [username, setUsername] = useState("");
  const [isBanned, setIsBanned] = useState(false);
  const { error, showError } = useErrorMessage();
  const { loading, processUser } = useThreadsProcessor({
    showError,
    setIsBanned,
  });
  // Data State
  const [owner, setOwner] = useState<any>(null);
  const [tier1, setTier1] = useState<any[]>([]);
  const [tier2, setTier2] = useState<any[]>([]);
  const [dataReady, setDataReady] = useState(false);

  // --- MAIN HANDLER ---
  const handleGenerate = async () => {
    setOwner(null);
    setTier1([]);
    setTier2([]);
    setDataReady(false);

    processUser(username, async (data) => {
      const result = await analyzeUserNetwork(
        data.posts || [],
        data.replies || []
      );

      setOwner(result.owner);
      setTier1(result.topConnections);
      setTier2(result.otherConnections);
      setDataReady(true);
    });
  };

  return (
    <div className="relative min-h-screen w-full bg-neutral-950 text-white selection:bg-green-500/30 overflow-x-hidden font-mono">
      {error && <ErrorAlert message={error} />}
      {loading && <CatSupportModal />}

      <main className="container mx-auto py-12 max-w-3xl min-h-screen flex flex-col items-center relative z-10 px-4">
        {isBanned && <BannedOverlay />}

        {!dataReady ? (
          <SearchMode
            username={username}
            setUsername={setUsername}
            onGenerate={handleGenerate}
            icon={<Users className="w-full h-full" />}
            title={
              <>
                Твоє Тредс{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-green-400 to-emerald-600">
                  Оточення
                </span>
              </>
            }
            description={
              <>
                [SYSTEM]: Scanning social bubble protocol... <br />
                Введи нікнейм, щоб згенерувати карту взаємодій.
              </>
            }
            buttonText="ЗАПУСТИТИ АНАЛІЗ"
          />
        ) : (
          <div className="w-full flex flex-col items-center animate-in fade-in duration-500">
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
