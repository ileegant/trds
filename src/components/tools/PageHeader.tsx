interface PageHeaderProps {
  title: string;
  highlight: string;
  description: string;
}

export const PageHeader = ({ title, highlight, description }: PageHeaderProps) => {
  return (
    <div className="flex flex-col items-center text-center mb-14">
      <h1 className="font-display text-4xl md:text-7xl font-black uppercase tracking-tighter text-white mb-6 leading-none">
        {title}
        <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-500 via-slate-200 to-white">
          {highlight}
        </span>
      </h1>

      <p className="text-neutral-500 text-xs md:text-lg max-w-2xl font-mono leading-relaxed">
        {description}
      </p>
    </div>
  );
};