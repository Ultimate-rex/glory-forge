import { useState, useEffect } from "react";
import { Shield, Users, DollarSign, Gift, RefreshCw, Plus, Minus, Search } from "lucide-react";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface UserProfile {
  id: string;
  user_id: string;
  username: string;
  basic_credits: number;
  premium_credits: number;
  binance_id: string | null;
}

export const AdminPanel = () => {
  const { refreshProfile } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [creditAmount, setCreditAmount] = useState(1);
  const [creditType, setCreditType] = useState<"basic" | "premium">("basic");

  const fetchUsers = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch users");
      return;
    }

    setUsers(data || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const addCredits = async (user: UserProfile) => {
    const newBasic = creditType === "basic" ? user.basic_credits + creditAmount : user.basic_credits;
    const newPremium = creditType === "premium" ? user.premium_credits + creditAmount : user.premium_credits;

    const { error } = await supabase
      .from("profiles")
      .update({ basic_credits: newBasic, premium_credits: newPremium })
      .eq("id", user.id);

    if (error) {
      toast.error("Failed to add credits");
      return;
    }

    toast.success(`Added ${creditAmount} ${creditType} credits to ${user.username}`);
    fetchUsers();
    refreshProfile();
  };

  const removeCredits = async (user: UserProfile) => {
    const newBasic = creditType === "basic" ? Math.max(0, user.basic_credits - creditAmount) : user.basic_credits;
    const newPremium = creditType === "premium" ? Math.max(0, user.premium_credits - creditAmount) : user.premium_credits;

    const { error } = await supabase
      .from("profiles")
      .update({ basic_credits: newBasic, premium_credits: newPremium })
      .eq("id", user.id);

    if (error) {
      toast.error("Failed to remove credits");
      return;
    }

    toast.success(`Removed ${creditAmount} ${creditType} credits from ${user.username}`);
    fetchUsers();
    refreshProfile();
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="card-gaming-bordered">
      <div className="flex items-center gap-3 p-4 border-b border-border/30">
        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Admin Control Panel</h3>
          <p className="text-xs text-muted-foreground">Manage users and credits</p>
        </div>
        <Button variant="success" size="sm" className="ml-auto" onClick={fetchUsers}>
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
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-gaming pl-11"
          />
        </div>

        {/* Credit Controls */}
        <div className="p-3 rounded-lg bg-secondary/30 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Amount:</span>
            <div className="flex items-center gap-1">
              <Button size="sm" variant="outline" onClick={() => setCreditAmount(Math.max(1, creditAmount - 1))}>
                <Minus className="w-3 h-3" />
              </Button>
              <span className="w-12 text-center font-medium">{creditAmount}</span>
              <Button size="sm" variant="outline" onClick={() => setCreditAmount(creditAmount + 1)}>
                <Plus className="w-3 h-3" />
              </Button>
            </div>
            <div className="flex gap-1 ml-4">
              <Button
                size="sm"
                variant={creditType === "basic" ? "default" : "outline"}
                onClick={() => setCreditType("basic")}
                className={creditType === "basic" ? "bg-basic text-white" : ""}
              >
                Basic
              </Button>
              <Button
                size="sm"
                variant={creditType === "premium" ? "default" : "outline"}
                onClick={() => setCreditType("premium")}
                className={creditType === "premium" ? "bg-premium text-black" : ""}
              >
                Premium
              </Button>
            </div>
          </div>
        </div>

        {/* User List */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading users...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No users found</div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className="p-3 rounded-lg bg-secondary/20 border border-border/30 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{user.username}</p>
                    <div className="flex gap-2 text-xs">
                      <span className="text-basic">● Basic: {user.basic_credits}</span>
                      <span className="text-premium">★ Premium: {user.premium_credits}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="success" onClick={() => addCredits(user)}>
                    <Plus className="w-3 h-3 mr-1" />
                    Add
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => removeCredits(user)}>
                    <Minus className="w-3 h-3 mr-1" />
                    Remove
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-secondary/30 text-center">
            <Users className="w-6 h-6 mx-auto mb-1 text-basic" />
            <p className="text-2xl font-bold">{users.length}</p>
            <p className="text-xs text-muted-foreground">Total Users</p>
          </div>
          <div className="p-3 rounded-lg bg-secondary/30 text-center">
            <DollarSign className="w-6 h-6 mx-auto mb-1 text-premium" />
            <p className="text-2xl font-bold">
              {users.reduce((acc, u) => acc + u.basic_credits + u.premium_credits, 0)}
            </p>
            <p className="text-xs text-muted-foreground">Total Credits</p>
          </div>
        </div>
      </div>
    </div>
  );
};
