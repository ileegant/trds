import { TOOLS } from "@/lib/constants";
import { ToolCard } from "@/components/tools/ToolCard";
import { SecretToolCard } from "@/components/tools/SecretToolCard";
import { ToolsHero } from "@/components/tools/ToolsHero";

export default function BrowsePage() {
  return (
    <div className="relative min-h-screen w-full bg-neutral-950 text-white selection:bg-slate-500/30 overflow-x-hidden">
      <main className="container mx-auto px-4 py-20 max-w-7xl">
        <ToolsHero />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
          {TOOLS.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
          <SecretToolCard />
        </div>
      </main>
    </div>
  );
}
