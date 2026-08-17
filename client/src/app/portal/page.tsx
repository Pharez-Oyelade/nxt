"use client";

import { useAuthGuard } from "@/hooks/useAuthGuard";

export default function PortalPage() {
  const { user, isLoading, isAuthenticated } = useAuthGuard("client");

  if (isLoading) return <div className="p-8 text-sm">Checking session...</div>;
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-card p-4 flex justify-between items-center">
        <h1 className="font-bold text-xl">NXT Client Portal</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          Welcome, {user?.name}
        </div>
      </header>
      
      <main className="p-8 max-w-7xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">Your Dashboard</h2>
        <div className="bg-card border border-border/50 rounded-2xl p-8 text-center text-muted-foreground">
          <p>Welcome to your portal. Your project dashboard will appear here soon.</p>
        </div>
      </main>
    </div>
  );
}
