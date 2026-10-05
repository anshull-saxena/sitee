"use client";

import { MagnifyingGlass, X } from "@phosphor-icons/react";

interface HeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedTag: string | null;
  onTagSelect: (tag: string | null) => void;
  allTags: string[];
}

export function Hero({
  searchQuery,
  onSearchChange,
  selectedTag,
  onTagSelect,
  allTags,
}: HeroProps) {
  return (
    <section className="pt-8 pb-6 sm:pt-12 sm:pb-8 max-w-7xl mx-auto px-4 sm:px-6 w-full">
      <div className="max-w-3xl">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1a1918] border border-[#2e2b26] text-xs font-mono text-[#d97757] mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#d97757]" />
          <span>CURATED VAULT</span>
        </div>

        {/* Headline (max 2 lines) */}
        <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-[#f5f4ef] leading-[1.15]">
          Curated links. Polished to a craft.
        </h1>

        {/* Subtext (max 20 words) */}
        <p className="mt-3 text-base sm:text-lg text-[#9e9b91] leading-relaxed max-w-[55ch]">
          A personal directory of essential web tools, design references, and creative resources.
        </p>

        {/* Search & Tag Filter Box */}
        <div className="mt-6 flex flex-col gap-3">
          <div className="relative w-full max-w-xl">
            <MagnifyingGlass
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9e9b91]"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by title, tag, or domain..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#1a1918] border border-[#2e2b26] focus:border-[#d97757] focus:outline-none text-sm text-[#f5f4ef] placeholder-[#9e9b91]/70 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9e9b91] hover:text-[#f5f4ef] p-1"
                aria-label="Clear search"
              >
                <X size={14} weight="bold" />
              </button>
            )}
          </div>

          {/* Tags list */}
          {allTags.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <button
                type="button"
                onClick={() => onTagSelect(null)}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-colors ${
                  selectedTag === null
                    ? "bg-[#d97757] text-white"
                    : "bg-[#1a1918] text-[#9e9b91] hover:text-[#f5f4ef] border border-[#2e2b26]"
                }`}
              >
                All
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onTagSelect(selectedTag === tag ? null : tag)}
                  className={`px-3 py-1 rounded-full text-xs font-mono transition-colors ${
                    selectedTag === tag
                      ? "bg-[#d97757] text-white"
                      : "bg-[#1a1918] text-[#9e9b91] hover:text-[#f5f4ef] border border-[#2e2b26]"
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
