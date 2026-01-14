import { useState } from "react";
import { Header } from "./Header";
import { CollapsibleSection } from "./CollapsibleSection";
import { GroupCard } from "./GroupCard";
import { LaunchGroupForm } from "./LaunchGroupForm";
import { BuyCreditsSection } from "./BuyCreditsSection";
import { GiftCouponsSection } from "./GiftCouponsSection";
import { DollarSign, History, Gift, Clock, Lock, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";

interface DashboardProps {
  username: string;
  onLogout: () => void;
}

export const Dashboard = ({ username, onLogout }: DashboardProps) => {
  const [basicCredits] = useState(5);
  const [premiumCredits] = useState(0);

  const mockGroup = {
    rank: 1,
    name: "HEROPLAY~",
    motto: "Always Forever ~",
    id: "3048008875",
    region: "IND",
    botsCount: 1,
    level: 4,
    members: "5/35",
    captain: "9999990543",
    totalGlory: 118270,
    isPremium: true,
    bots: [
      {
        id: "14403152427",
        clanId: "3048008875",
        region: "IND",
        status: "running" as const,
        uptime: "6h 1m",
        totalGlory: 118270,
        updatedAt: "20:08:30",
      },
    ],
  };

  return (
    <div className="min-h-screen pb-8">
      <Header
        username={username}
        basicCredits={basicCredits}
        premiumCredits={premiumCredits}
        onLogout={onLogout}
      />

      <main className="container py-6 space-y-4">
        {/* Refresh Button */}
        <div className="flex justify-start">
          <Button variant="success" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>

        {/* Buy Credits */}
        <CollapsibleSection
          icon={<DollarSign className="w-5 h-5" />}
          title="Buy Credits"
          titleColor="text-premium"
        >
          <div className="flex items-center gap-3 text-sm mb-2">
            <span className="badge-basic">● Basic: $1.00</span>
            <span className="badge-premium">★ Premium: $ 15.00</span>
          </div>
          <BuyCreditsSection />
        </CollapsibleSection>

        {/* Transaction History */}
        <CollapsibleSection
          icon={<History className="w-5 h-5" />}
          title="Transaction History"
          titleColor="text-foreground"
          count={3}
          onRefresh={() => {}}
        >
          <div className="py-8 text-center text-muted-foreground">
            <History className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No transactions yet</p>
          </div>
        </CollapsibleSection>

        {/* Gift Coupons */}
        <CollapsibleSection
          icon={<Gift className="w-5 h-5" />}
          title="Gift Coupons"
          titleColor="text-success"
          onRefresh={() => {}}
        >
          <GiftCouponsSection />
        </CollapsibleSection>

        {/* Group History */}
        <CollapsibleSection
          icon={<Clock className="w-5 h-5" />}
          title="Group History"
          titleColor="text-premium"
          count={5}
          onRefresh={() => {}}
        >
          <div className="py-8 text-center text-muted-foreground">
            <Clock className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No group history</p>
          </div>
        </CollapsibleSection>

        {/* Launch New Group */}
        <LaunchGroupForm premiumCredits={premiumCredits} />

        {/* My Active Groups */}
        <div className="card-gaming-bordered">
          <div className="flex items-center justify-between p-4 border-b border-border/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center text-muted-foreground">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-foreground">My Active Groups</h3>
              <span className="px-2 py-0.5 rounded-full bg-success/20 text-success text-xs font-medium">
                1
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">⏱ 20:08:29</span>
              <Button variant="success" size="sm">
                <RefreshCw className="w-4 h-4 mr-1" />
                Refresh
              </Button>
            </div>
          </div>
          <div className="p-4">
            <GroupCard {...mockGroup} />
          </div>
        </div>
      </main>
    </div>
  );
};
