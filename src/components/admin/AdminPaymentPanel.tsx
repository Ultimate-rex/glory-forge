import { useState, useEffect } from "react";
import { Check, X, RefreshCw, Clock, Search } from "lucide-react";
import { Button } from "../ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Transaction {
  id: string;
  user_id: string;
  transaction_id: string;
  amount: number;
  credits_requested: number;
  credit_type: string;
  status: string;
  created_at: string;
  username?: string;
}

export const AdminPaymentPanel = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "rejected">("pending");

  const fetchTransactions = async () => {
    setIsLoading(true);
    const { data: transData, error } = await supabase
      .from("transactions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch transactions");
      setIsLoading(false);
      return;
    }

    const userIds = [...new Set((transData || []).map(t => t.user_id))];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, username")
      .in("user_id", userIds);

    const profileMap = new Map(profiles?.map(p => [p.user_id, p.username]) || []);
    setTransactions((transData || []).map(t => ({
      ...t,
      username: profileMap.get(t.user_id) || "Unknown"
    })));
    setIsLoading(false);
  };

  useEffect(() => { fetchTransactions(); }, []);

  const confirmTransaction = async (transaction: Transaction) => {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("basic_credits, premium_credits")
      .eq("user_id", transaction.user_id)
      .maybeSingle();

    if (profileError || !profile) {
      toast.error("User profile not found");
      return;
    }

    const newBasic = transaction.credit_type === "basic"
      ? profile.basic_credits + transaction.credits_requested
      : profile.basic_credits;
    const newPremium = transaction.credit_type === "premium"
      ? profile.premium_credits + transaction.credits_requested
      : profile.premium_credits;

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ basic_credits: newBasic, premium_credits: newPremium })
      .eq("user_id", transaction.user_id);

    if (updateError) { toast.error("Failed to update credits"); return; }

    const { error: transError } = await supabase
      .from("transactions")
      .update({ status: "confirmed", confirmed_at: new Date().toISOString() })
      .eq("id", transaction.id);

    if (transError) { toast.error("Failed to update transaction"); return; }

    toast.success(`✓ Confirmed ${transaction.credits_requested} ${transaction.credit_type} → ${transaction.username}`);
    fetchTransactions();
  };

  const rejectTransaction = async (transaction: Transaction) => {
    const { error } = await supabase
      .from("transactions")
      .update({ status: "rejected" })
      .eq("id", transaction.id);

    if (error) { toast.error("Failed to reject"); return; }
    toast.success("Transaction rejected");
    fetchTransactions();
  };

  const filtered = transactions.filter(t => {
    const matchesSearch = t.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.transaction_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || t.status === filter;
    return matchesSearch && matchesFilter;
  });

  const pendingCount = transactions.filter(t => t.status === "pending").length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-premium" />
          <h3 className="font-semibold text-foreground">Payment Confirmations</h3>
          {pendingCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-premium/20 text-premium text-xs font-bold">
              {pendingCount} pending
            </span>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={fetchTransactions}>
          <RefreshCw className="w-4 h-4 mr-1" /> Refresh
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by username or TXN ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-gaming pl-10 text-sm"
          />
        </div>
      </div>
      <div className="flex gap-1">
        {(["all", "pending", "confirmed", "rejected"] as const).map(f => (
          <Button
            key={f}
            size="sm"
            variant={filter === f ? "default" : "outline"}
            onClick={() => setFilter(f)}
            className={filter === f && f === "pending" ? "bg-premium text-black" : ""}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </Button>
        ))}
      </div>

      {/* Transactions */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {isLoading ? (
          <div className="text-center py-6 text-muted-foreground">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">No transactions found</div>
        ) : (
          filtered.map((t) => (
            <div
              key={t.id}
              className={`p-3 rounded-lg border ${
                t.status === "pending"
                  ? "bg-premium/5 border-premium/30"
                  : t.status === "confirmed"
                  ? "bg-success/5 border-success/30"
                  : "bg-destructive/5 border-destructive/30"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{t.username}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      t.status === "pending" ? "bg-premium/20 text-premium"
                        : t.status === "confirmed" ? "bg-success/20 text-success"
                        : "bg-destructive/20 text-destructive"
                    }`}>
                      {t.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground truncate">TXN: {t.transaction_id}</p>
                  <div className="flex gap-3 text-xs mt-1">
                    <span className={t.credit_type === "premium" ? "text-premium" : "text-basic"}>
                      {t.credits_requested} {t.credit_type}
                    </span>
                    <span className="text-muted-foreground">${t.amount}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {new Date(t.created_at).toLocaleString()}
                  </p>
                </div>
                {t.status === "pending" && (
                  <div className="flex gap-1 shrink-0">
                    <Button size="sm" variant="success" onClick={() => confirmTransaction(t)}>
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => rejectTransaction(t)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
