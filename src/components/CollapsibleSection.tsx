import { ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import { useState, ReactNode } from "react";
import { Button } from "./ui/button";

interface CollapsibleSectionProps {
  icon: ReactNode;
  title: string;
  count?: number;
  children: ReactNode;
  defaultOpen?: boolean;
  onRefresh?: () => void;
  titleColor?: string;
}

export const CollapsibleSection = ({
  icon,
  title,
  count,
  children,
  defaultOpen = false,
  onRefresh,
  titleColor = "text-foreground",
}: CollapsibleSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="card-gaming-bordered overflow-hidden">
      <div
        className="section-header"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center text-muted-foreground">
            {icon}
          </div>
          <h3 className={`font-semibold ${titleColor}`}>{title}</h3>
          {count !== undefined && (
            <span className="px-2 py-0.5 rounded-full bg-secondary text-xs text-muted-foreground">
              {count}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {onRefresh && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onRefresh();
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Refresh
            </Button>
          )}
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
      </div>
      {isOpen && <div className="p-4 pt-0 border-t border-border/30">{children}</div>}
    </div>
  );
};
