import Link from "next/link";
import { MoreVertical, Edit, Archive, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CaseStudyCardProps {
  cs: any;
  view: "card" | "list";
  onDelete: (id: string) => void;
  onArchive: (id: string, status: string) => void;
  onToggleStatus: (id: string, status: string) => void;
  isStatusPending: boolean;
}

export function CaseStudyCard({
  cs,
  view,
  onDelete,
  onArchive,
  onToggleStatus,
  isStatusPending,
}: CaseStudyCardProps) {
  const formattedDate = new Date(cs.createdAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const getStatusBadge = (status: string) => (
    <span
      className={`px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-full backdrop-blur-md shadow-sm ${
        status === "published"
          ? "bg-green-500/80 text-white"
          : status === "draft"
            ? "bg-black/50 text-white"
            : "bg-orange-500/80 text-white"
      }`}
    >
      {status}
    </span>
  );

  const getToggle = () => (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
        {cs.status}
      </span>
      <button
        type="button"
        onClick={() => onToggleStatus(cs._id, cs.status)}
        disabled={isStatusPending || cs.status === "archived"}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 ${
          cs.status === "published" ? "bg-green-500" : "bg-muted-foreground/30"
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            cs.status === "published" ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );

  const getDropdownMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="secondary"
            size="icon"
            className={`w-8 h-8 rounded-full shadow-sm ${
              view === "card"
                ? "bg-white/90 hover:bg-white text-black"
                : "bg-muted/50 hover:bg-muted"
            }`}
          />
        }
      >
        <MoreVertical className="w-4 h-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 rounded-xl">
        <DropdownMenuItem
          render={
            <Link
              href={`/admin/case-studies/${cs._id}/edit`}
              className="cursor-pointer"
            />
          }
          className="rounded-lg m-1"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onArchive(cs._id, cs.status)}
          className="cursor-pointer rounded-lg m-1"
        >
          <Archive className="w-4 h-4 mr-2" />
          {cs.status === "archived" ? "Unarchive" : "Archive"}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onDelete(cs._id)}
          className="cursor-pointer text-destructive focus:bg-destructive/40 focus:text-destructive rounded-lg m-1"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  if (view === "list") {
    return (
      <div className="group flex items-center gap-4 bg-card border border-border/50 p-3 pr-4 rounded-xl hover:shadow-md hover:border-accent/30 transition-all duration-300">
        <div className="relative h-16 w-24 shrink-0 bg-muted/30 rounded-lg overflow-hidden">
          {cs.coverImage && cs.coverImage.length > 0 ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cs.coverImage[0].url}
              alt={cs.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground/30 text-[10px] font-medium">
              No image
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base line-clamp-1 group-hover:text-accent transition-colors">
            {cs.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">
            {cs.description || "No description provided."}
          </p>
        </div>

        <div className="flex items-center gap-6 shrink-0">
          <span className="text-xs font-medium text-muted-foreground hidden md:block">
            {formattedDate}
          </span>
          <div className="hidden sm:block">{getStatusBadge(cs.status)}</div>
          {getToggle()}
          {getDropdownMenu()}
        </div>
      </div>
    );
  }

  // Default Card View
  return (
    <div className="group flex flex-col bg-card border border-border/50 rounded-2xl overflow-hidden hover:shadow-lg hover:border-accent/30 transition-all duration-300">
      <div className="relative aspect-video w-full bg-muted/30 overflow-hidden">
        {cs.coverImage && cs.coverImage.length > 0 ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cs.coverImage[0].url}
            alt={cs.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground/30 text-sm font-medium">
            No cover image
          </div>
        )}

        <div className="absolute top-3 left-3">{getStatusBadge(cs.status)}</div>
        <div className="absolute top-3 right-3 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          {getDropdownMenu()}
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-accent transition-colors">
          {cs.title}
        </h3>
        <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2 flex-1">
          {cs.description || "No description provided."}
        </p>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/40">
          <span className="text-[11px] font-medium text-muted-foreground">
            {formattedDate}
          </span>
          {getToggle()}
        </div>
      </div>
    </div>
  );
}
