import { useState } from "react";
import { Header } from "./Header";
import { CollapsibleSection } from "./CollapsibleSection";
import { LaunchGroupForm } from "./LaunchGroupForm";
import { BuyCreditsSection } from "./BuyCreditsSection";
import { GiftCouponsSection } from "./GiftCouponsSection";
import { DollarSign, History, Gift, Clock, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";

interface DashboardProps {
  username: string;
  onLogout: () => void;
}

export const Dashboard = ({ username, onLogout }: DashboardProps) => {
  const [basicCredits] = useState(5);
  const [premiumCredits] = useState(0);

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
      </main>
    </div>
  );
};
