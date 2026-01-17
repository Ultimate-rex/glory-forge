export const Logo = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <img
          src="/logo.png"
          alt="FF Glory"
          className="w-12 h-12 rounded-xl object-contain glow-primary"
        />
      </div>
      <span className="text-xl font-display font-bold text-foreground tracking-wider">
        FF Glory
      </span>
    </div>
  );
};
