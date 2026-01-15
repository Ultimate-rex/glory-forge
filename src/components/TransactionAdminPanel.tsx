import { useState, useEffect } from "react";
import { Shield, Check, X, RefreshCw, Clock, Search } from "lucide-react";
import { Button } from "./ui/button";
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

export const TransactionAdminPanel = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchTransactions = async () => {
    setIsLoading(true);
    
    // Fetch transactions with user info
    const { data: transData, error: transError } = await supabase
      .from("transactions")
      .select("*")
      .order("created_at", { ascending: false });

    if (transError) {
      toast.error("Failed to fetch transactions");
      setIsLoading(false);
      return;
    }

    // Fetch usernames for each transaction
    const userIds = [...new Set((transData || []).map(t => t.user_id))];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, username")
      .in("user_id", userIds);

    const profileMap = new Map(profiles?.map(p => [p.user_id, p.username]) || []);
    
    const transactionsWithUsernames = (transData || []).map(t => ({
      ...t,
      username: profileMap.get(t.user_id) || "Unknown"
    }));

    setTransactions(transactionsWithUsernames);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const confirmTransaction = async (transaction: Transaction) => {
    // First update the user's credits
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("basic_credits, premium_credits")
      .eq("user_id", transaction.user_id)
      .maybeSingle();

    if (profileError || !profile) {
      toast.error("Failed to fetch user profile");
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

    if (updateError) {
      toast.error("Failed to update credits");
      return;
    }

    // Update transaction status
    const { error: transError } = await supabase
      .from("transactions")
      .update({ status: "confirmed", confirmed_at: new Date().toISOString() })
      .eq("id", transaction.id);

    if (transError) {
      toast.error("Failed to update transaction");
      return;
    }

    toast.success(`Confirmed ${transaction.credits_requested} ${transaction.credit_type} credits for ${transaction.username}`);
    fetchTransactions();
  };

  const rejectTransaction = async (transaction: Transaction) => {
    const { error } = await supabase
      .from("transactions")
      .update({ status: "rejected" })
      .eq("id", transaction.id);

    if (error) {
      toast.error("Failed to reject transaction");
      return;
    }

    toast.success("Transaction rejected");
    fetchTransactions();
  };

  const filteredTransactions = transactions.filter(
    (t) =>
      t.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.transaction_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingCount = transactions.filter(t => t.status === "pending").length;

  return (
    <div className="card-gaming-bordered">
      <div className="flex items-center gap-3 p-4 border-b border-border/30">
        <div className="w-10 h-10 rounded-lg bg-premium/20 flex items-center justify-center text-premium">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Pending Transactions</h3>
          <p className="text-xs text-muted-foreground">{pendingCount} awaiting confirmation</p>
        </div>
        <Button variant="outline" size="sm" className="ml-auto" onClick={fetchTransactions}>
          <RefreshCw className="w-4 h-4 mr-1" />
          Refresh
        </Button>
      </div>

      <div className="p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by username or transaction ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-gaming pl-11"
          />
        </div>

        {/* Transaction List */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading transactions...</div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No transactions found</div>
          ) : (
            filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className={`p-4 rounded-lg border ${
                  transaction.status === "pending"
                    ? "bg-premium/5 border-premium/30"
                    : transaction.status === "confirmed"
                    ? "bg-success/5 border-success/30"
                    : "bg-destructive/5 border-destructive/30"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{transaction.username}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        transaction.status === "pending"
                          ? "bg-premium/20 text-premium"
                          : transaction.status === "confirmed"
                          ? "bg-success/20 text-success"
                          : "bg-destructive/20 text-destructive"
                      }`}>
                        {transaction.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      TXN: {transaction.transaction_id}
                    </p>
                    <div className="flex gap-4 text-sm">
                      <span>
                        <span className="text-muted-foreground">Credits: </span>
                        <span className={transaction.credit_type === "premium" ? "text-premium" : "text-basic"}>
                          {transaction.credits_requested} {transaction.credit_type}
                        </span>
                      </span>
                      <span>
                        <span className="text-muted-foreground">Amount: </span>
                        ${transaction.amount}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(transaction.created_at).toLocaleString()}
                    </p>
                  </div>
                  {transaction.status === "pending" && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="success" onClick={() => confirmTransaction(transaction)}>
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => rejectTransaction(transaction)}>
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
    </div>
  );
};
