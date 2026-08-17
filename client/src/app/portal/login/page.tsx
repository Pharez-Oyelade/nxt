"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

export default function PortalLogin() {
  const { login, isLoggingIn } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ email, password, expectedRole: "client" });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="flex aspect-square size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <span className="font-bold text-2xl">N</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Client Portal</h2>
          <p className="text-muted-foreground mt-2">
            Welcome back to NXT Agency
          </p>
        </div>

        <div className="bg-card border border-border/50 rounded-2xl shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@example.com"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoggingIn || !email || !password}
            >
              {isLoggingIn ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              Sign In
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
