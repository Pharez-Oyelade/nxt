"use client";

import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useUpdateProfile, useUpdatePassword } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Save, KeyRound, User as UserIcon } from "lucide-react";
import { notify } from "@/lib/toast";

export default function AccountPage() {
  const { user } = useAuthStore();
  
  const updateProfile = useUpdateProfile();
  const updatePassword = useUpdatePassword();

  const [mounted, setMounted] = useState(false);
  
  // Profile state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    setMounted(true);
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleUpdateProfile = () => {
    updateProfile.mutate({ name, email });
  };

  const handleUpdatePassword = () => {
    if (newPassword !== confirmPassword) {
      notify.error("New passwords do not match");
      return;
    }
    updatePassword.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        }
      }
    );
  };

  if (!mounted) return null;

  return (
    <div className="flex-1 p-4 md:p-8 pt-6 max-w-4xl mx-auto space-y-8 w-full pb-12">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-primary">
          Account Settings
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage your profile details and security.
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Details */}
        <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-border/40 flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-lg shrink-0">
              <UserIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">Profile Details</h3>
              <p className="text-sm text-muted-foreground">
                Update your personal information.
              </p>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium leading-none">
                  Full Name
                </label>
                <Input
                  id="name"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium leading-none">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div className="pt-2">
              <Button 
                onClick={handleUpdateProfile} 
                disabled={updateProfile.isPending || (name === user?.name && email === user?.email)}
              >
                {updateProfile.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Profile
              </Button>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-border/40 flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-lg shrink-0">
              <KeyRound className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">Security</h3>
              <p className="text-sm text-muted-foreground">
                Change your account password.
              </p>
            </div>
          </div>
          <div className="p-6 space-y-4 max-w-md">
            <div className="space-y-2">
              <label htmlFor="currentPassword" className="text-sm font-medium leading-none">
                Current Password
              </label>
              <Input
                id="currentPassword"
                type="password"
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="newPassword" className="text-sm font-medium leading-none">
                New Password
              </label>
              <Input
                id="newPassword"
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium leading-none">
                Confirm New Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            
            <div className="pt-2">
              <Button 
                onClick={handleUpdatePassword} 
                disabled={updatePassword.isPending || !currentPassword || !newPassword || !confirmPassword}
                variant="default"
              >
                {updatePassword.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <KeyRound className="w-4 h-4 mr-2" />
                )}
                Update Password
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
