import { LayoutGrid, List } from "lucide-react";

interface DataViewToggleProps {
  view: "card" | "list";
  onViewChange: (view: "card" | "list") => void;
}

export function DataViewToggle({ view, onViewChange }: DataViewToggleProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center rounded-lg border border-border/40 p-1 bg-muted/20">
      <button
        onClick={() => onViewChange("card")}
        className={`p-1.5 rounded-md transition-colors ${
          view === "card"
            ? "bg-background shadow-sm text-primary"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
        }`}
        aria-label="Grid View"
      >
        <LayoutGrid className="w-4 h-4" />
      </button>
      <button
        onClick={() => onViewChange("list")}
        className={`p-1.5 rounded-md transition-colors ${
          view === "list"
            ? "bg-background shadow-sm text-primary"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
        }`}
        aria-label="List View"
      >
        <List className="w-4 h-4" />
      </button>
    </div>
  );
}

export function DataViewLayout({
  view,
  children,
}: {
  view: "card" | "list";
  children: React.ReactNode;
}) {
  if (view === "list") {
    return <div className="flex flex-col space-y-4">{children}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {children}
    </div>
  );
}
