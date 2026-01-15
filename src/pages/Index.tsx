import { useState } from "react";
import { AuthForm } from "@/components/AuthForm";
import { Dashboard } from "@/components/Dashboard";
import { LandingPage } from "@/components/LandingPage";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user, isLoading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return <Dashboard />;
  }

  if (showAuth) {
    return <AuthForm onBack={() => setShowAuth(false)} />;
  }

  return <LandingPage onGetStarted={() => setShowAuth(true)} />;
};

export default Index;
