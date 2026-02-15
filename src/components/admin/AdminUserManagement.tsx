import { useState, useEffect } from "react";
import { Users, Search, Plus, Minus, Trash2, Edit, Ban, RefreshCw, Eye, EyeOff } from "lucide-react";
import { Button } from "../ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface UserProfile {
  id: string;
  user_id: string;
  username: string;
  email: string | null;
  basic_credits: number;
  premium_credits: number;
  binance_id: string | null;
  created_at: string;
}

export const AdminUserManagement = () => {
  const { refreshProfile } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editBasic, setEditBasic] = useState(0);
  const [editPremium, setEditPremium] = useState(0);
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
      setIsLoading(false);
      return;
    }
    setUsers(data || []);
    setIsLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const addCredits = async (user: UserProfile) => {
    const newBasic = creditType === "basic" ? user.basic_credits + creditAmount : user.basic_credits;
    const newPremium = creditType === "premium" ? user.premium_credits + creditAmount : user.premium_credits;

    const { error } = await supabase
      .from("profiles")
      .update({ basic_credits: newBasic, premium_credits: newPremium })
      .eq("id", user.id);

    if (error) { toast.error("Failed to add credits"); return; }
    toast.success(`+${creditAmount} ${creditType} → ${user.username}`);
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

    if (error) { toast.error("Failed to remove credits"); return; }
    toast.success(`-${creditAmount} ${creditType} from ${user.username}`);
    fetchUsers();
    refreshProfile();
  };

  const startEditing = (user: UserProfile) => {
    setEditingUser(user.id);
    setEditBasic(user.basic_credits);
    setEditPremium(user.premium_credits);
  };

  const saveEdit = async (user: UserProfile) => {
    const { error } = await supabase
      .from("profiles")
      .update({ basic_credits: editBasic, premium_credits: editPremium })
      .eq("id", user.id);

    if (error) { toast.error("Failed to update"); return; }
    toast.success(`Updated ${user.username}`);
    setEditingUser(null);
    fetchUsers();
    refreshProfile();
  };

  const deleteUser = async (user: UserProfile) => {
    if (!confirm(`Delete user "${user.username}"? This cannot be undone.`)) return;
    
    // Delete profile and roles (cascade will handle related data)
    const { error: roleError } = await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", user.user_id);

    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", user.id);

    if (error) { toast.error("Failed to delete user profile"); return; }
    toast.success(`Deleted ${user.username}`);
    fetchUsers();
  };

  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.user_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-basic" />
          <h3 className="font-semibold text-foreground">User Management</h3>
          <span className="px-2 py-0.5 rounded-full bg-secondary text-xs text-muted-foreground">
            {users.length}
          </span>
        </div>
        <Button variant="outline" size="sm" onClick={fetchUsers}>
          <RefreshCw className="w-4 h-4 mr-1" /> Refresh
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by username, email, or user ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-gaming pl-10 text-sm"
        />
      </div>

      {/* Quick Credit Controls */}
      <div className="p-3 rounded-lg bg-secondary/30 border border-border/30">
        <p className="text-xs text-muted-foreground mb-2">Quick Credit Action</p>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1">
            <Button size="sm" variant="outline" onClick={() => setCreditAmount(Math.max(1, creditAmount - 1))}>
              <Minus className="w-3 h-3" />
            </Button>
            <span className="w-10 text-center font-medium text-sm">{creditAmount}</span>
            <Button size="sm" variant="outline" onClick={() => setCreditAmount(creditAmount + 1)}>
              <Plus className="w-3 h-3" />
            </Button>
          </div>
          <div className="flex gap-1">
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
      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No users found</div>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className="p-3 rounded-lg bg-secondary/20 border border-border/30"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-foreground truncate">{user.username}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{user.user_id}</p>
                    {user.email && (
                      <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Credits display / edit */}
              {editingUser === user.id ? (
                <div className="mt-2 p-2 rounded bg-secondary/40 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-basic">Basic Credits</label>
                      <input
                        type="number"
                        value={editBasic}
                        onChange={(e) => setEditBasic(Number(e.target.value))}
                        className="input-gaming text-sm py-1"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-premium">Premium Credits</label>
                      <input
                        type="number"
                        value={editPremium}
                        onChange={(e) => setEditPremium(Number(e.target.value))}
                        className="input-gaming text-sm py-1"
                      />
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="success" onClick={() => saveEdit(user)}>Save</Button>
                    <Button size="sm" variant="outline" onClick={() => setEditingUser(null)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex gap-3 text-xs">
                    <span className="text-basic">● Basic: {user.basic_credits}</span>
                    <span className="text-premium">★ Premium: {user.premium_credits}</span>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="success" onClick={() => addCredits(user)} title="Add credits">
                      <Plus className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => removeCredits(user)} title="Remove credits">
                      <Minus className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => startEditing(user)} title="Edit">
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => deleteUser(user)} title="Delete user">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              )}

              <p className="text-[10px] text-muted-foreground mt-1">
                Joined: {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-2 rounded-lg bg-secondary/30 text-center">
          <p className="text-lg font-bold">{users.length}</p>
          <p className="text-[10px] text-muted-foreground">Users</p>
        </div>
        <div className="p-2 rounded-lg bg-secondary/30 text-center">
          <p className="text-lg font-bold text-basic">
            {users.reduce((a, u) => a + u.basic_credits, 0)}
          </p>
          <p className="text-[10px] text-muted-foreground">Basic</p>
        </div>
        <div className="p-2 rounded-lg bg-secondary/30 text-center">
          <p className="text-lg font-bold text-premium">
            {users.reduce((a, u) => a + u.premium_credits, 0)}
          </p>
          <p className="text-[10px] text-muted-foreground">Premium</p>
        </div>
      </div>
    </div>
  );
};
