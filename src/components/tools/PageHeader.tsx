export const PageHeader = () => {
  return (
    <div className="flex flex-col items-center text-center mb-14">
      <h1 className="font-display text-4xl md:text-7xl font-black uppercase tracking-tighter text-white mb-6 leading-none">
        Обери спосіб
        <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-500 via-slate-200 to-white">
          приниження
        </span>
      </h1>

      <p className="text-neutral-500 text-xs md:text-lg max-w-2xl font-mono leading-relaxed">
        Думаєш, твої треди комусь цікаві? Досить жити в ілюзіях. Обирай генератор, вводь нік і готуйся плакати. Ми розберемо твій профіль на атоми.
      </p>
    </div>
  );
};