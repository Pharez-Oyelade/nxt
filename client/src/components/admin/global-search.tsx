"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/axios";

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length >= 2) {
        setLoading(true);
        try {
          const res = await api.get(`/search?q=${query}`);
          setResults(res.data.results);
        } catch (error) {
          console.error("Search error:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setResults({});
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSelect = (url: string) => {
    setOpen(false);
    router.push(url);
  };

  const getUrl = (type: string, id: string) => {
    const isAdmin = window.location.pathname.startsWith("/admin");
    const prefix = isAdmin ? "/admin" : "/portal";
    
    switch (type) {
      case "projects": return `${prefix}/projects/${id}`;
      case "tasks": return `${prefix}/tasks/${id}`;
      case "invoices": return `${prefix}/invoices/${id}`;
      case "clients": return `/admin/clients/${id}`;
      case "leads": return `/admin/leads/${id}`;
      case "blogs": return `/admin/blogs/${id}`;
      case "casestudies": return `/admin/case-studies/${id}`;
      default: return prefix;
    }
  };

  return (
    <>
      <div 
        className="relative w-64 hidden md:flex items-center group cursor-text"
        onClick={() => setOpen(true)}
      >
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
        <div className="w-full h-9 bg-background/50 pl-8 pr-2 flex items-center justify-between border rounded-md text-sm text-muted-foreground hover:border-primary/50 transition-colors">
          <span>Search...</span>
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
      </div>

      <Button 
        variant="ghost" 
        size="icon" 
        className="md:hidden"
        onClick={() => setOpen(true)}
      >
        <Search className="h-5 w-5" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 overflow-hidden max-w-2xl gap-0">
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type to search..."
              className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-0 focus-visible:ring-0 shadow-none"
            />
          </div>
          
          <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
            {loading && query.length >= 2 && (
              <div className="space-y-2 p-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            )}
            
            {!loading && query.length >= 2 && Object.keys(results).length === 0 && (
              <p className="p-4 text-center text-sm text-muted-foreground">No results found.</p>
            )}

            {!loading && Object.entries(results).map(([category, items]: [string, any]) => {
              if (!items || items.length === 0) return null;
              
              return (
                <div key={category} className="space-y-2">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase px-2">
                    {category}
                  </h4>
                  <div className="flex flex-col gap-1">
                    {items.map((item: any) => (
                      <button
                        key={item._id}
                        onClick={() => handleSelect(getUrl(category, item._id))}
                        className="flex items-center w-full px-2 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground text-left transition-colors"
                      >
                        <span className="truncate flex-1">
                          {item.name || item.title || item.companyName || item.invoiceNumber}
                        </span>
                        {item.status && (
                          <span className="text-xs text-muted-foreground ml-2 capitalize border px-2 py-0.5 rounded-full">
                            {item.status}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
