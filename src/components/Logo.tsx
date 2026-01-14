import { Zap } from "lucide-react";

export const Logo = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center glow-primary">
          <Zap className="w-7 h-7 text-primary-foreground" fill="currentColor" />
        </div>
      </div>
      <span className="text-xl font-display font-bold text-foreground tracking-wider">
        FFGlory
      </span>
    </div>
  );
};
