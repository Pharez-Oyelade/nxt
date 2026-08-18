"use client";

import React from "react";
import { MessageSquare, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CommunicationsPage() {
  return (
    <div className="flex-1 p-4 md:p-8 pt-6 max-w-7xl mx-auto space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary">
            Communications
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage messages, client notes, and internal communications.
          </p>
        </div>
      </div>

      <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm min-h-[400px] flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <MessageSquare className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-2">
          Coming Soon
        </h3>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          We are currently building out a robust communications feature that will allow you to leave notes on projects, message clients directly, and manage all your correspondence in one place.
        </p>
        <Button variant="outline" disabled className="gap-2">
          <Clock className="w-4 h-4" /> Feature in Development
        </Button>
      </div>
    </div>
  );
}
