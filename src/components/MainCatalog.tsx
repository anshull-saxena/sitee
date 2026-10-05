"use client";

import { useState, useMemo } from "react";
import type { LinkItem } from "@/types/link";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { LinkGrid } from "./LinkGrid";
import { CliGuideModal } from "./CliGuideModal";
import { Footer } from "./Footer";

interface MainCatalogProps {
  links: LinkItem[];
}

export function MainCatalog({ links }: MainCatalogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isCliGuideOpen, setIsCliGuideOpen] = useState(false);

  // Compute unique sorted tags
  const allTags = useMemo(() => {
    const set = new Set<string>();
    links.forEach((l) => l.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [links]);

  return (
    <div className="flex-1 flex flex-col w-full">
      <Header
        totalLinks={links.length}
        onOpenCliGuide={() => setIsCliGuideOpen(true)}
      />

      <main className="flex-1 flex flex-col">
        <Hero
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedTag={selectedTag}
          onTagSelect={setSelectedTag}
          allTags={allTags}
        />

        <LinkGrid
          initialLinks={links}
          searchQuery={searchQuery}
          selectedTag={selectedTag}
          onClearFilters={() => {
            setSearchQuery("");
            setSelectedTag(null);
          }}
        />
      </main>

      <Footer />

      <CliGuideModal
        isOpen={isCliGuideOpen}
        onClose={() => setIsCliGuideOpen(false)}
      />
    </div>
  );
}
