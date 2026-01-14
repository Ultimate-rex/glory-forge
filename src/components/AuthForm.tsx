import { useState } from "react";
import { Zap, User, Lock, CheckCircle, MessageCircle, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Logo } from "./Logo";

interface AuthFormProps {
  onLogin: (username: string) => void;
}

export const AuthForm = ({ onLogin }: AuthFormProps) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      onLogin(username);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="card-gaming-bordered p-8 space-y-6">
          {/* Logo */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center glow-primary">
              <Zap className="w-9 h-9 text-primary-foreground" fill="currentColor" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-display font-bold text-foreground">
                {isSignUp ? "Create Account" : "Welcome Back"}
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                {isSignUp ? "Join " : "Sign in to "}
                <span className="text-primary font-medium">FFGlory</span> panel
              </p>
            </div>
          </div>

          {/* Toggle */}
          <div className="flex rounded-lg bg-secondary p-1">
            <button
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                !isSignUp ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setIsSignUp(false)}
            >
              Sign In
            </button>
            <button
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                isSignUp ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setIsSignUp(true)}
            >
              Sign Up
            </button>
          </div>

          {/* Open Registration Banner */}
          {isSignUp && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-success/10 border border-success/20 text-success text-sm">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <div>
                <span className="font-medium">Open Registration</span>
                <p className="text-xs text-success/80">No invitation code required - create your account now!</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-foreground font-medium">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={isSignUp ? "choose a username" : "Enter your username"}
                  className="input-gaming pl-11"
                />
              </div>
              {isSignUp && (
                <p className="text-xs text-muted-foreground">Lowercase letters, numbers, and underscore only</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm text-foreground font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isSignUp ? "Create a password" : "Enter your password"}
                  className="input-gaming pl-11"
                />
              </div>
              {isSignUp && <p className="text-xs text-muted-foreground">Minimum 6 characters</p>}
            </div>

            {isSignUp && (
              <div className="space-y-2">
                <label className="text-sm text-foreground font-medium">Confirm Password</label>
                <div className="relative">
                  <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="input-gaming pl-11"
                  />
                </div>
              </div>
            )}

            <Button type="submit" className="w-full" size="lg">
              <User className="w-4 h-4 mr-2" />
              {isSignUp ? "Create Account" : "Sign In"}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-card text-muted-foreground">Need help? Contact Admin</span>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-2">
            <Button variant="outline" className="w-full text-success border-success/30 hover:bg-success/10">
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp
            </Button>
            <Button variant="outline" className="w-full text-basic border-basic/30 hover:bg-basic/10">
              <Send className="w-4 h-4 mr-2" />
              Telegram
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
