import { Users, Crown, Trophy, MoreVertical, RefreshCw, Square, Info, Trash2, RotateCcw } from "lucide-react";
import { Button } from "./ui/button";

interface Bot {
  id: string;
  clanId: string;
  region: string;
  status: "running" | "stopped";
  uptime: string;
  totalGlory: number;
  updatedAt: string;
}

interface GroupCardProps {
  rank: number;
  name: string;
  motto: string;
  id: string;
  region: string;
  botsCount: number;
  level: number;
  members: string;
  captain: string;
  totalGlory: number;
  bots: Bot[];
  isPremium?: boolean;
}

export const GroupCard = ({
  rank,
  name,
  motto,
  id,
  region,
  botsCount,
  level,
  members,
  captain,
  totalGlory,
  bots,
  isPremium = true,
}: GroupCardProps) => {
  return (
    <div className="card-gaming-bordered p-4 space-y-4">
      {/* Group Header */}
      <div className="flex items-start gap-3">
        <div className="flex items-center gap-2">
          {isPremium && (
            <div className="w-8 h-8 rounded-lg bg-premium/20 flex items-center justify-center text-premium font-bold text-sm">
              #{rank}
            </div>
          )}
          <div className="relative">
            <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center overflow-hidden">
              <span className="text-2xl">🦁</span>
            </div>
            <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-600 text-white">
              LV.{level}
            </span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-foreground truncate">{name}</h4>
          </div>
          <p className="text-xs text-muted-foreground italic">"{motto}"</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
            <span>ID: {id}</span>
            <span>|</span>
            <span>{region}</span>
            <span>|</span>
            <span className="text-basic">{botsCount} BOTS</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="text-center">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Users className="w-4 h-4" />
              <span className="text-xs">MEMBERS</span>
            </div>
            <span className="font-bold text-foreground">{members}</span>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Crown className="w-4 h-4" />
              <span className="text-xs">CAPTAIN</span>
            </div>
            <span className="font-bold text-foreground">{captain}</span>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-1 text-premium">
              <Trophy className="w-4 h-4" />
              <span className="text-xs">TOTAL GLORY</span>
            </div>
            <span className="font-bold text-premium text-lg">{totalGlory.toLocaleString()}</span>
          </div>
          <Button variant="ghost" size="icon">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Bots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {bots.map((bot) => (
          <div
            key={bot.id}
            className="p-3 rounded-lg bg-secondary/30 border border-border/50 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-primary font-mono text-sm">{bot.id}</span>
              <div className={bot.status === "running" ? "status-running" : "status-stopped"}>
                <span className={`w-2 h-2 rounded-full ${bot.status === "running" ? "bg-success animate-pulse" : "bg-destructive"}`} />
                {bot.status === "running" ? "RUNNING" : "STOPPED"}
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="px-2 py-1 rounded bg-secondary">Clan: {bot.clanId}</span>
              <span className="px-2 py-1 rounded bg-secondary">Region: {bot.region}</span>
            </div>

            <div className="flex items-center gap-6">
              <div>
                <span className="text-xs text-muted-foreground block">UPTIME</span>
                <span className="font-medium text-foreground">{bot.uptime}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">TOTAL GLORY</span>
                <span className="font-medium text-premium">{bot.totalGlory > 0 ? bot.totalGlory.toLocaleString() : "-"}</span>
                {bot.totalGlory > 0 && (
                  <span className="text-[10px] text-muted-foreground ml-2">Updated: {bot.updatedAt}</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Button size="sm" variant="outline" className="text-xs">
                <RefreshCw className="w-3 h-3 mr-1" />
                Restart
              </Button>
              <Button size="sm" variant="outline" className="text-xs">
                <Square className="w-3 h-3 mr-1" />
                Stop
              </Button>
              <Button size="sm" variant="success" className="text-xs">
                <Info className="w-3 h-3 mr-1" />
                Details
              </Button>
              <Button size="sm" variant="danger" className="text-xs">
                <Trash2 className="w-3 h-3 mr-1" />
                Delete
              </Button>
              <Button size="sm" variant="ghost" className="text-xs text-muted-foreground">
                <RotateCcw className="w-3 h-3 mr-1" />
                Refund
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
