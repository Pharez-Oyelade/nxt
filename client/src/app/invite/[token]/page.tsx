"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { notify } from "@/lib/toast";

export default function InvitePage() {
  const params = useParams();
  const token = params.token as string;
  const { acceptInvite, isAcceptingInvite } = useAuth();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      notify.error("Passwords do not match");
      return;
    }
    
    if (password.length < 8) {
      notify.error("Password must be at least 8 characters long");
      return;
    }

    await acceptInvite({ token, password });
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
          <h2 className="text-3xl font-bold tracking-tight">Setup Your Account</h2>
          <p className="text-muted-foreground mt-2">
            Welcome to the NXT Agency Client Portal. Please create a password to continue.
          </p>
        </div>

        <div className="bg-card border border-border/50 rounded-2xl shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">New Password</label>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Confirm Password</label>
              <Input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isAcceptingInvite || !password || !confirmPassword}
            >
              {isAcceptingInvite ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              Create Account
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
