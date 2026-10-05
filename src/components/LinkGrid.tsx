"use client";

import { useMemo, useState } from "react";
import {
  SquaresFour,
  List,
  SortAscending,
  Clock,
  Sparkle,
  MagnifyingGlass,
} from "@phosphor-icons/react";
import type { LinkItem } from "@/types/link";
import { LinkCard } from "./LinkCard";
import { LinkModal } from "./LinkModal";

interface LinkGridProps {
  initialLinks: LinkItem[];
  searchQuery: string;
  selectedTag: string | null;
  onClearFilters: () => void;
}

export function LinkGrid({
  initialLinks,
  searchQuery,
  selectedTag,
  onClearFilters,
}: LinkGridProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"newest" | "title">("newest");
  const [selectedLink, setSelectedLink] = useState<LinkItem | null>(null);

  // Filter links by search query and selected tag
  const filteredLinks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return initialLinks
      .filter((link) => {
        const matchesTag =
          !selectedTag ||
          link.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase());

        if (!matchesTag) return false;
        if (!query) return true;

        const titleMatch = link.title.toLowerCase().includes(query);
        const descMatch = link.description.toLowerCase().includes(query);
        const urlMatch = link.url.toLowerCase().includes(query);
        const tagMatch = link.tags.some((t) => t.toLowerCase().includes(query));

        return titleMatch || descMatch || urlMatch || tagMatch;
      })
      .sort((a, b) => {
        if (sortBy === "title") {
          return a.title.localeCompare(b.title);
        }
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
  }, [initialLinks, searchQuery, selectedTag, sortBy]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full pb-16">
      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 mb-6 border-b border-[#2e2b26]">
        <div className="flex items-center gap-2 text-xs font-mono text-[#9e9b91]">
          <span>Showing</span>
          <span className="text-[#f5f4ef] font-semibold">
            {filteredLinks.length}
          </span>
          <span>of {initialLinks.length} items</span>
          {selectedTag && (
            <span className="ml-1 px-2 py-0.5 rounded bg-[#d97757]/15 text-[#d97757] border border-[#d97757]/30">
              #{selectedTag}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 self-end sm:self-center">
          {/* Sort Switcher */}
          <div className="flex items-center gap-1 bg-[#1a1918] p-1 rounded-xl border border-[#2e2b26]">
            <button
              type="button"
              onClick={() => setSortBy("newest")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                sortBy === "newest"
                  ? "bg-[#242220] text-[#f5f4ef]"
                  : "text-[#9e9b91] hover:text-[#f5f4ef]"
              }`}
              title="Sort by latest additions"
            >
              <Clock size={13} />
              <span>Latest</span>
            </button>
            <button
              type="button"
              onClick={() => setSortBy("title")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                sortBy === "title"
                  ? "bg-[#242220] text-[#f5f4ef]"
                  : "text-[#9e9b91] hover:text-[#f5f4ef]"
              }`}
              title="Sort alphabetically"
            >
              <SortAscending size={13} />
              <span>Alphabetical</span>
            </button>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 bg-[#1a1918] p-1 rounded-xl border border-[#2e2b26]">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "grid"
                  ? "bg-[#242220] text-[#f5f4ef]"
                  : "text-[#9e9b91] hover:text-[#f5f4ef]"
              }`}
              aria-label="Grid layout"
            >
              <SquaresFour size={16} weight={viewMode === "grid" ? "fill" : "regular"} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "list"
                  ? "bg-[#242220] text-[#f5f4ef]"
                  : "text-[#9e9b91] hover:text-[#f5f4ef]"
              }`}
              aria-label="List layout"
            >
              <List size={16} weight={viewMode === "list" ? "bold" : "regular"} />
            </button>
          </div>
        </div>
      </div>

      {/* Grid or List Layout */}
      {filteredLinks.length > 0 ? (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              : "flex flex-col gap-3"
          }
        >
          {filteredLinks.map((link) => (
            <LinkCard
              key={link.id}
              link={link}
              viewMode={viewMode}
              onSelect={setSelectedLink}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-2xl bg-[#1a1918]/50 border border-dashed border-[#2e2b26]">
          <div className="w-12 h-12 rounded-xl bg-[#242220] border border-[#33302b] flex items-center justify-center text-[#9e9b91] mb-4">
            <MagnifyingGlass size={24} />
          </div>
          <h3 className="text-lg font-semibold text-[#f5f4ef]">
            No links found
          </h3>
          <p className="mt-1 text-sm text-[#9e9b91] max-w-sm">
            Try adjusting your search query or removing the selected tag filter.
          </p>
          <button
            type="button"
            onClick={onClearFilters}
            className="mt-5 px-4 py-2 rounded-xl bg-[#242220] hover:bg-[#2d2a26] text-xs font-mono text-[#f5f4ef] border border-[#33302b] transition-colors"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Detail Modal */}
      <LinkModal
        link={selectedLink}
        onClose={() => setSelectedLink(null)}
      />
    </section>
  );
}
