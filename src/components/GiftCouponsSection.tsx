import { Gift, Check, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

export const GiftCouponsSection = () => {
  const [couponCode, setCouponCode] = useState("");

  return (
    <div className="space-y-6 pt-4">
      {/* Redeem Coupon */}
      <div className="p-4 rounded-lg border border-success/30 space-y-3">
        <div className="flex items-center gap-2 text-success">
          <Gift className="w-5 h-5" />
          <h4 className="font-semibold">Redeem a Coupon</h4>
        </div>
        <p className="text-sm text-muted-foreground">Enter a coupon code to receive credits</p>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            placeholder="XXXX-XXXX-XXXX"
            className="input-gaming flex-1 font-mono tracking-widest"
          />
          <Button variant="success">
            <Check className="w-4 h-4 mr-1" />
            Redeem
          </Button>
        </div>
      </div>

      {/* Create Coupon */}
      <div className="p-4 rounded-lg border border-border space-y-3">
        <div className="flex items-center gap-2 text-primary">
          <Plus className="w-5 h-5" />
          <h4 className="font-semibold">Create a Coupon</h4>
        </div>
        <p className="text-sm text-muted-foreground">Convert your credits into a shareable coupon</p>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted-foreground block mb-2">BASIC</label>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline">-</Button>
              <span className="flex-1 text-center py-2 bg-secondary rounded">0</span>
              <Button size="sm" variant="outline">+</Button>
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-2">★ PREMIUM</label>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline">-</Button>
              <span className="flex-1 text-center py-2 bg-secondary rounded">0</span>
              <Button size="sm" variant="outline">+</Button>
            </div>
          </div>
        </div>

        <Button variant="outline" className="w-full">
          Create Coupon
        </Button>
      </div>
    </div>
  );
};
