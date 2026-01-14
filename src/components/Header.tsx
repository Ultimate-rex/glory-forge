import { Bell, LogOut } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "./ui/button";

interface HeaderProps {
  username: string;
  basicCredits: number;
  premiumCredits: number;
  onLogout: () => void;
}

export const Header = ({ username, basicCredits, premiumCredits, onLogout }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Logo />
          <span className="hidden sm:inline-flex text-xs font-medium text-success px-2 py-0.5 rounded-full bg-success/10 border border-success/20">
            ● LIVE
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden md:inline-flex px-3 py-1.5 rounded-lg bg-secondary text-sm text-muted-foreground">
            {username} (user)
          </span>
          
          <div className="badge-basic">
            <span className="w-2 h-2 rounded-full bg-basic" />
            Basic: {basicCredits}
          </div>
          
          <div className="badge-premium">
            <span className="text-premium">★</span>
            Premium: {premiumCredits}
          </div>

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
          </Button>

          <Button variant="outline" size="sm" onClick={onLogout} className="hidden sm:flex">
            <LogOut className="w-4 h-4 mr-1" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};
