import { DollarSign, Copy, Check, Send } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const BINANCE_ID = "1200028749";

export const BuyCreditsSection = () => {
  const { user } = useAuth();
  const [basicCredits, setBasicCredits] = useState(0);
  const [premiumCredits, setPremiumCredits] = useState(0);
  const [copied, setCopied] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const submitTransaction = async (creditType: "basic" | "premium", credits: number, amount: number) => {
    if (!user) {
      toast.error("Please login first");
      return;
    }

    const { error } = await supabase.from("transactions").insert({
      user_id: user.id,
      transaction_id: transactionId,
      amount: amount,
      credits_requested: credits,
      credit_type: creditType,
      status: "pending"
    });

    if (error) {
      console.error("Transaction error:", error);
      throw error;
    }
  };

  const handleSubmitTransaction = async () => {
    if (!transactionId.trim()) {
      toast.error("Please enter your transaction ID");
      return;
    }

    if (basicCredits === 0 && premiumCredits === 0) {
      toast.error("Please select at least 1 credit");
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit transactions for each credit type
      if (basicCredits > 0) {
        await submitTransaction("basic", basicCredits, basicCredits * basicPrice);
      }
      if (premiumCredits > 0) {
        await submitTransaction("premium", premiumCredits, premiumCredits * premiumPrice);
      }

      toast.success("Transaction submitted! Admin will verify and add credits shortly.");
      setTransactionId("");
      setBasicCredits(0);
      setPremiumCredits(0);
    } catch (error) {
      toast.error("Failed to submit transaction. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
        <div className="flex items-center justify-between flex-wrap gap-2">
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

      {/* Transaction ID Input */}
      <div className="p-4 rounded-lg border border-success/30 bg-success/5 space-y-3">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          <Send className="w-4 h-4 text-success" />
          Transaction ID
        </label>
        <input
          type="text"
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
          placeholder="Enter your Binance transaction ID after payment"
          className="input-gaming"
        />
        <p className="text-xs text-muted-foreground">
          After sending payment, paste the transaction ID here for verification
        </p>
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
        <Button 
          variant="success" 
          className="w-full mt-4" 
          onClick={handleSubmitTransaction}
          disabled={isSubmitting || !transactionId.trim() || (basicCredits === 0 && premiumCredits === 0)}
        >
          <DollarSign className="w-4 h-4 mr-2" />
          {isSubmitting ? "Submitting..." : "Submit Transaction for Verification"}
        </Button>
      </div>
    </div>
  );
};