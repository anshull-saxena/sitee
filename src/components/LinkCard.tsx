"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  Copy,
  Check,
  Tag as TagIcon,
  Globe,
} from "@phosphor-icons/react";
import type { LinkItem } from "@/types/link";

interface LinkCardProps {
  link: LinkItem;
  viewMode: "grid" | "list";
  onSelect: (link: LinkItem) => void;
}

export function LinkCard({ link, viewMode, onSelect }: LinkCardProps) {
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Extract clean hostname for display
  const domain = (() => {
    try {
      return new URL(link.url).hostname.replace(/^www\./, "");
    } catch {
      return link.url;
    }
  })();

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(link.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (viewMode === "list") {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={() => onSelect(link)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect(link);
          }
        }}
        className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#1a1918] border border-[#2e2b26] hover:border-[#d97757]/50 hover:bg-[#22201e] transition-all duration-200 cursor-pointer text-left active:scale-[0.99]"
      >
        <div className="flex items-center gap-4 min-w-0">
          <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-[#242220] border border-[#33302b] flex-shrink-0">
            {link.thumbnail && !imgError ? (
              <Image
                src={link.thumbnail}
                alt={link.title}
                fill
                sizes="64px"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#9e9b91]">
                <Globe size={20} weight="regular" />
              </div>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-[#f5f4ef] text-base truncate group-hover:text-[#d97757] transition-colors">
                {link.title}
              </h3>
              <span className="text-xs font-mono text-[#9e9b91] bg-[#242220] px-2 py-0.5 rounded-full border border-[#33302b]">
                {domain}
              </span>
            </div>
            <p className="text-sm text-[#9e9b91] truncate max-w-[50ch] mt-0.5">
              {link.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:flex-shrink-0 self-end sm:self-center">
          <div className="hidden md:flex items-center gap-1.5 flex-wrap">
            {link.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-mono text-[#9e9b91] bg-[#121110] px-2 py-0.5 rounded-md border border-[#2e2b26]"
              >
                #{tag}
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={handleCopy}
            title={copied ? "Copied URL" : "Copy URL"}
            className="p-2 rounded-lg bg-[#242220] hover:bg-[#2f2c27] text-[#9e9b91] hover:text-[#f5f4ef] border border-[#33302b] transition-colors"
          >
            {copied ? (
              <Check size={16} weight="bold" className="text-emerald-400" />
            ) : (
              <Copy size={16} weight="regular" />
            )}
          </button>

          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-2 rounded-lg bg-[#d97757] hover:bg-[#c56545] text-white transition-colors"
            title="Open link in new tab"
          >
            <ArrowUpRight size={16} weight="bold" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <article
      onClick={() => onSelect(link)}
      className="group relative flex flex-col rounded-2xl bg-[#1a1918] border border-[#2e2b26] hover:border-[#d97757]/60 hover:bg-[#22201e] transition-all duration-300 overflow-hidden cursor-pointer active:scale-[0.99] shadow-sm hover:shadow-lg hover:shadow-[#d97757]/5"
    >
      {/* Thumbnail Header */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#242220] border-b border-[#2e2b26]">
        {link.thumbnail && !imgError ? (
          <Image
            src={link.thumbnail}
            alt={link.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#1a1918] to-[#252321] text-[#9e9b91]">
            <Globe size={36} weight="thin" className="opacity-50 mb-2" />
            <span className="text-xs font-mono">{domain}</span>
          </div>
        )}

        {/* Floating Domain Pill */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#121110]/85 backdrop-blur-md border border-white/10 text-xs font-mono text-[#f5f4ef] shadow-sm">
          <Globe size={12} weight="bold" className="text-[#d97757]" />
          <span>{domain}</span>
        </div>

        {/* Floating Actions on Hover */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
          <button
            type="button"
            onClick={handleCopy}
            className="p-2 rounded-lg bg-[#121110]/85 backdrop-blur-md border border-white/10 text-[#f5f4ef] hover:text-[#d97757] hover:border-[#d97757]/50 transition-colors shadow-sm"
            title={copied ? "Copied" : "Copy URL"}
          >
            {copied ? (
              <Check size={14} weight="bold" className="text-emerald-400" />
            ) : (
              <Copy size={14} weight="bold" />
            )}
          </button>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-2 rounded-lg bg-[#d97757] hover:bg-[#c56545] text-white transition-colors shadow-sm"
            title="Open link"
          >
            <ArrowUpRight size={14} weight="bold" />
          </a>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-5 justify-between gap-4">
        <div>
          <h3 className="font-semibold text-lg text-[#f5f4ef] tracking-tight group-hover:text-[#d97757] transition-colors leading-snug">
            {link.title}
          </h3>
          <p className="mt-2 text-sm text-[#9e9b91] line-clamp-2 leading-relaxed">
            {link.description}
          </p>
        </div>

        {/* Tags footer */}
        <div className="flex items-center justify-between pt-3 border-t border-[#2e2b26]/70 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <TagIcon size={12} weight="regular" className="text-[#9e9b91]" />
            {link.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[11px] text-[#9e9b91] hover:text-[#f5f4ef] bg-[#121110] px-2 py-0.5 rounded-md border border-[#2e2b26] transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>

          <span className="font-mono text-[11px] text-[#9e9b91]/70">
            {new Date(link.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>
    </article>
  );
}
