import { Zap, Globe, Users } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

interface LaunchGroupFormProps {
  premiumCredits: number;
}

export const LaunchGroupForm = ({ premiumCredits }: LaunchGroupFormProps) => {
  const [region, setRegion] = useState("middle-east");
  const [clanId, setClanId] = useState("");

  const regions = [
    { value: "middle-east", label: "🌍 Middle East", type: "Premium", cost: 15 },
    { value: "brasil", label: "🇧🇷 Brasil", type: "Premium", cost: 15 },
    { value: "india", label: "🇮🇳 India", type: "Basic", cost: 1 },
    { value: "indonesia", label: "🇮🇩 Indonesia", type: "Basic", cost: 1 },
  ];

  const selectedRegion = regions.find((r) => r.value === region);
  const isPremium = selectedRegion?.type === "Premium";
  const hasEnoughCredits = premiumCredits >= 1;

  return (
    <div className="card-gaming-bordered p-5 space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
          <Zap className="w-5 h-5 text-success" />
        </div>
        <h3 className="font-semibold text-success">Launch New Group</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <Globe className="w-4 h-4" />
            ACCOUNTS REGION
          </label>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="input-gaming cursor-pointer"
          >
            {regions.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label} {r.type === "Premium" ? "★" : "●"} {r.type}
              </option>
            ))}
          </select>
          <p className="text-sm">
            Cost:{" "}
            <span className={isPremium ? "text-premium font-medium" : "text-basic font-medium"}>
              1 {isPremium ? "Premium" : "Basic"} credit
            </span>
            <span className="text-muted-foreground"> • ${selectedRegion?.cost}.00</span>
          </p>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            CLAN ID
          </label>
          <input
            type="text"
            value={clanId}
            onChange={(e) => setClanId(e.target.value)}
            placeholder="e.g. 123456789"
            className="input-gaming"
          />
        </div>
      </div>

      <Button
        className="w-full"
        variant={hasEnoughCredits ? "success" : "outline"}
        disabled={!hasEnoughCredits || !clanId}
      >
        <Zap className="w-4 h-4 mr-2" />
        {hasEnoughCredits ? (
          `Start Group (1 ${isPremium ? "Premium" : "Basic"} Credit)`
        ) : (
          `Insufficient ${isPremium ? "Premium" : "Basic"} Credits (Need 1, Have ${premiumCredits})`
        )}
      </Button>
    </div>
  );
};
