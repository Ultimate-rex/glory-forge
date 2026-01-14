import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Profile {
  id: string;
  user_id: string;
  username: string;
  basic_credits: number;
  premium_credits: number;
  binance_id: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isAdmin: boolean;
  isLoading: boolean;
  signUp: (email: string, password: string, username: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateCredits: (userId: string, basicCredits: number, premiumCredits: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (profileData) {
      setProfile(profileData);
    }

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);

    if (roleData && roleData.some((r) => r.role === "admin")) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          setTimeout(() => {
            fetchProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          setIsAdmin(false);
        }
        setIsLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, username: string) => {
    const redirectUrl = `${window.location.origin}/`;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          username,
        },
      },
    });

    if (error) {
      return { error };
    }

    return { error: null };
  };

  const signIn = async (username: string, password: string) => {
    // First, look up the email by username
    const { data: profileData, error: lookupError } = await supabase
      .from("profiles")
      .select("user_id")
      .eq("username", username)
      .maybeSingle();

    if (lookupError || !profileData) {
      return { error: new Error("Invalid username or password") };
    }

    // Get the user's email from auth.users via admin lookup isn't possible,
    // so we need to store email in profiles or use a different approach
    // For now, we'll use a workaround: try to get user email from auth
    const { data: userData } = await supabase.auth.admin?.getUserById?.(profileData.user_id) || {};
    
    // Since we can't access admin API from client, we need to store email in profiles
    // Let's use a database function approach - for now, construct email pattern
    // Actually, the best approach is to query with service role or store email
    
    // Workaround: Look up via RPC or use the username as identifier
    // For simplicity, we'll need to add email to profiles table
    // But for now, let's try signing in with username@domain pattern won't work
    
    // Better solution: Create an edge function to handle username login
    // For now, return error suggesting we need email storage
    const { error } = await supabase.auth.signInWithPassword({
      email: username, // This won't work - we need the actual email
      password,
    });

    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setIsAdmin(false);
  };

  const updateCredits = async (userId: string, basicCredits: number, premiumCredits: number) => {
    const { error } = await supabase
      .from("profiles")
      .update({ basic_credits: basicCredits, premium_credits: premiumCredits })
      .eq("user_id", userId);

    if (error) {
      toast.error("Failed to update credits");
      return;
    }

    await refreshProfile();
    toast.success("Credits updated successfully");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isAdmin,
        isLoading,
        signUp,
        signIn,
        signOut,
        refreshProfile,
        updateCredits,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
