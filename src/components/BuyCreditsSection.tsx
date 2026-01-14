import { DollarSign, Minus, Plus, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";

const BINANCE_ID = "1200028749";

export const BuyCreditsSection = () => {
  const [basicCredits, setBasicCredits] = useState(0);
  const [premiumCredits, setPremiumCredits] = useState(0);
  const [copied, setCopied] = useState(false);

  const basicPrice = 1;
  const premiumPrice = 15;

  const quickAmounts = [5, 10, 20];

  const copyBinanceId = () => {
    navigator.clipboard.writeText(BINANCE_ID);
    setCopied(true);
    toast.success("Binance ID copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const totalAmount = basicCredits * basicPrice + premiumCredits * premiumPrice;

  const handlePayNow = () => {
    if (totalAmount === 0) {
      toast.error("Please select at least 1 credit");
      return;
    }
    toast.success(`Order placed! Pay $${totalAmount.toFixed(2)} to Binance ID: ${BINANCE_ID}`);
  };

  return (
    <div className="space-y-6 pt-4">
      {/* Language Selector */}
      <div className="flex items-center justify-end gap-2">
        <button className="px-2 py-1 rounded text-xs bg-secondary text-foreground">🇬🇧 English</button>
        <button className="px-2 py-1 rounded text-xs text-muted-foreground hover:bg-secondary">🇸🇦 العربية</button>
        <button className="px-2 py-1 rounded text-xs text-muted-foreground hover:bg-secondary">🇮🇳 हिंदी</button>
        <button className="px-2 py-1 rounded text-xs text-muted-foreground hover:bg-secondary">🇮🇩 Indonesia</button>
      </div>

      {/* Binance Pay Info */}
      <div className="p-4 rounded-lg border border-premium/30 bg-premium/5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">💳 Pay via Binance Pay</p>
            <p className="text-xs text-muted-foreground mt-1">Send payment to this Binance ID:</p>
          </div>
          <div className="flex items-center gap-2">
            <code className="px-3 py-1.5 rounded bg-secondary font-mono text-premium">{BINANCE_ID}</code>
            <Button size="sm" variant="outline" onClick={copyBinanceId}>
              {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Basic Credits */}
      <div className="p-4 rounded-lg border border-basic/30 space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-basic" />
          <h4 className="font-semibold text-foreground">Basic Credits</h4>
        </div>
        <p className="text-xs text-muted-foreground">For basic regions (India, BD, etc.)</p>

        <div className="space-y-3">
          <label className="text-xs text-muted-foreground">NUMBER OF BASIC CREDITS</label>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <Button size="sm" variant="outline" onClick={() => setBasicCredits(Math.max(0, basicCredits - 5))}>
                -5
              </Button>
              <Button size="sm" variant="outline" onClick={() => setBasicCredits(Math.max(0, basicCredits - 1))}>
                -1
              </Button>
            </div>
            <div className="flex-1 text-center py-2 rounded bg-secondary font-medium">
              {basicCredits}
            </div>
            <div className="flex gap-1">
              <Button size="sm" variant="outline" onClick={() => setBasicCredits(basicCredits + 1)}>
                +1
              </Button>
              <Button size="sm" variant="outline" onClick={() => setBasicCredits(basicCredits + 5)}>
                +5
              </Button>
            </div>
          </div>

          <div className="text-center py-2 rounded bg-secondary/50">
            Subtotal: <span className="text-success font-medium">${(basicCredits * basicPrice).toFixed(2)}</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {quickAmounts.map((amount) => (
              <Button key={amount} variant="outline" size="sm" onClick={() => setBasicCredits(amount)}>
                {amount} Basic
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Premium Credits */}
      <div className="p-4 rounded-lg border border-premium/30 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-premium">★</span>
          <h4 className="font-semibold text-foreground">Premium Credits</h4>
        </div>
        <p className="text-xs text-muted-foreground">For premium regions (ME, BR, etc.)</p>

        <div className="space-y-3">
          <label className="text-xs text-muted-foreground">NUMBER OF PREMIUM CREDITS</label>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <Button size="sm" variant="outline" onClick={() => setPremiumCredits(Math.max(0, premiumCredits - 5))}>
                -5
              </Button>
              <Button size="sm" variant="outline" onClick={() => setPremiumCredits(Math.max(0, premiumCredits - 1))}>
                -1
              </Button>
            </div>
            <div className="flex-1 text-center py-2 rounded bg-secondary font-medium">
              {premiumCredits}
            </div>
            <div className="flex gap-1">
              <Button size="sm" variant="outline" onClick={() => setPremiumCredits(premiumCredits + 1)}>
                +1
              </Button>
              <Button size="sm" variant="outline" onClick={() => setPremiumCredits(premiumCredits + 5)}>
                +5
              </Button>
            </div>
          </div>

          <div className="text-center py-2 rounded bg-secondary/50">
            Subtotal: <span className="text-premium font-medium">${(premiumCredits * premiumPrice).toFixed(2)}</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[1, 3, 5].map((amount) => (
              <Button key={amount} variant="outline" size="sm" onClick={() => setPremiumCredits(amount)}>
                {amount} Premium
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="p-4 rounded-lg border border-border space-y-3">
        <h4 className="font-semibold text-foreground flex items-center gap-2">
          <span className="w-5 h-5 rounded bg-secondary flex items-center justify-center text-xs">📋</span>
          Order Summary
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-basic">● Basic Credits:</span>
            <span>{basicCredits} × ${basicPrice}.00</span>
          </div>
          <div className="flex justify-between">
            <span className="text-premium">★ Premium Credits:</span>
            <span>{premiumCredits} × ${premiumPrice}.00</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-border font-medium">
            <span>Total Amount:</span>
            <span className="text-success text-lg">${totalAmount.toFixed(2)}</span>
          </div>
        </div>
        <Button variant="success" className="w-full mt-4" onClick={handlePayNow}>
          <DollarSign className="w-4 h-4 mr-2" />
          Pay Now via Binance
        </Button>
      </div>
    </div>
  );
};
