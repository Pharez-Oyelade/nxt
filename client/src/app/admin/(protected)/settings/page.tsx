"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useAuthStore } from "@/store/authStore";
import { useUpdateSettings } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Loader2, Moon, Sun, Laptop, Save } from "lucide-react";

export default function AdminSettingsPage() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { user } = useAuthStore();
  const { mutate: updateSettings, isPending } = useUpdateSettings();

  const [mounted, setMounted] = useState(false);
  const [currency, setCurrency] = useState("NGN");

  useEffect(() => {
    setMounted(true);
    if (user?.settings?.currency) {
      setCurrency(user.settings.currency);
    }
  }, [user]);

  const handleSaveCurrency = () => {
    updateSettings({ currency });
  };

  if (!mounted) return null;

  return (
    <div className="flex-1 p-4 md:p-8 pt-6 max-w-4xl mx-auto space-y-8 w-full pb-12">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-primary">
          Settings
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage your account preferences and application settings.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-border/40">
            <h3 className="text-lg font-semibold mb-1">Appearance</h3>
            <p className="text-sm text-muted-foreground">
              Customize how NXT looks on your device.
            </p>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => setTheme("light")}
              className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all ${
                theme === "light"
                  ? "border-primary bg-primary/5"
                  : "border-border/50 hover:border-primary/50 hover:bg-muted/50"
              }`}
            >
              <Sun className={`w-8 h-8 mb-3 ${theme === "light" ? "text-primary" : "text-muted-foreground"}`} />
              <span className="font-medium">Light</span>
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all ${
                theme === "dark"
                  ? "border-primary bg-primary/5"
                  : "border-border/50 hover:border-primary/50 hover:bg-muted/50"
              }`}
            >
              <Moon className={`w-8 h-8 mb-3 ${theme === "dark" ? "text-primary" : "text-muted-foreground"}`} />
              <span className="font-medium">Dark</span>
            </button>
            <button
              onClick={() => setTheme("system")}
              className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all ${
                theme === "system"
                  ? "border-primary bg-primary/5"
                  : "border-border/50 hover:border-primary/50 hover:bg-muted/50"
              }`}
            >
              <Laptop className={`w-8 h-8 mb-3 ${theme === "system" ? "text-primary" : "text-muted-foreground"}`} />
              <span className="font-medium">System</span>
            </button>
          </div>
        </div>

        <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-border/40">
            <h3 className="text-lg font-semibold mb-1">Regional</h3>
            <p className="text-sm text-muted-foreground">
              Set your preferred currency for dashboard and invoicing.
            </p>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-2 max-w-sm">
              <label htmlFor="currency" className="text-sm font-medium leading-none">
                Display Currency
              </label>
              <select
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="NGN">Nigerian Naira (₦)</option>
                <option value="USD">US Dollar ($)</option>
              </select>
            </div>
            
            <div className="pt-2">
              <Button 
                onClick={handleSaveCurrency} 
                disabled={isPending || currency === user?.settings?.currency}
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Preferences
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
