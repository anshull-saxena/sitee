"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  Copy,
  Check,
  Play,
  YoutubeLogo,
  CheckCircle,
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

  const domain = (() => {
    try {
      return new URL(link.url).hostname.replace(/^www\./, "");
    } catch {
      return link.url;
    }
  })();

  const isYouTube =
    !!link.youtubeId ||
    domain.includes("youtube.com") ||
    domain.includes("youtu.be");

  const channelName = link.author || domain;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(link.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedDate = (() => {
    try {
      const date = new Date(link.createdAt);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays <= 0) return "Today";
      if (diffDays === 1) return "1 day ago";
      if (diffDays < 30) return `${diffDays} days ago`;
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
      return "Recent";
    }
  })();

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
        className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3.5 rounded-xl bg-[#171615] border border-[#262422] hover:border-[#d97757]/60 hover:bg-[#1f1e1c] transition-all duration-200 cursor-pointer text-left active:scale-[0.99]"
      >
        <div className="flex items-center gap-4 min-w-0">
          {/* 16:9 Mini Thumbnail */}
          <div className="relative w-28 aspect-video rounded-lg overflow-hidden bg-[#242220] border border-[#302d29] flex-shrink-0">
            {link.thumbnail && !imgError ? (
              <Image
                src={link.thumbnail}
                alt={link.title}
                fill
                sizes="112px"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#9e9b91]">
                {isYouTube ? (
                  <YoutubeLogo size={24} weight="fill" className="text-red-500" />
                ) : (
                  <Globe size={20} />
                )}
              </div>
            )}

            {isYouTube && (
              <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/85 text-[10px] font-mono text-white flex items-center gap-0.5">
                <Play size={8} weight="fill" />
                <span>VIDEO</span>
              </div>
            )}
          </div>

          <div className="min-w-0">
            <h3 className="font-semibold text-[#f5f4ef] text-sm sm:text-base truncate group-hover:text-[#d97757] transition-colors">
              {link.title}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-xs text-[#9e9b91]">
              <span className="font-medium text-[#c5c3ba] truncate max-w-[20ch]">
                {channelName}
              </span>
              <span>•</span>
              <span className="font-mono text-[11px]">{formattedDate}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
          <button
            type="button"
            onClick={handleCopy}
            title={copied ? "Copied" : "Copy URL"}
            className="p-2 rounded-lg bg-[#22201e] hover:bg-[#2b2926] text-[#9e9b91] hover:text-[#f5f4ef] border border-[#2e2b26] transition-colors"
          >
            {copied ? (
              <Check size={14} weight="bold" className="text-emerald-400" />
            ) : (
              <Copy size={14} />
            )}
          </button>

          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-2 rounded-lg bg-[#d97757] hover:bg-[#c56545] text-white transition-colors"
            title="Open link"
          >
            <ArrowUpRight size={14} weight="bold" />
          </a>
        </div>
      </div>
    );
  }

  // YouTube Deck Grid Card
  return (
    <article
      onClick={() => onSelect(link)}
      className="group flex flex-col rounded-2xl bg-transparent transition-all duration-200 cursor-pointer active:scale-[0.99]"
    >
      {/* 16:9 Deck Thumbnail */}
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-[#1a1918] border border-[#282623] group-hover:border-[#d97757]/60 transition-colors shadow-sm">
        {link.thumbnail && !imgError ? (
          <Image
            src={link.thumbnail}
            alt={link.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#1c1a19] to-[#252220] text-[#9e9b91]">
            {isYouTube ? (
              <YoutubeLogo size={42} weight="fill" className="text-red-500/80 mb-2" />
            ) : (
              <Globe size={36} weight="thin" className="opacity-40 mb-2" />
            )}
            <span className="text-xs font-mono">{domain}</span>
          </div>
        )}

        {/* Hover Center Play Button Overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-[#d97757] text-white flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-200">
            {isYouTube ? (
              <Play size={22} weight="fill" className="ml-0.5" />
            ) : (
              <ArrowUpRight size={22} weight="bold" />
            )}
          </div>
        </div>

        {/* Duration / Source Badge */}
        <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/85 backdrop-blur-md text-[11px] font-mono font-medium text-white flex items-center gap-1 border border-white/10 shadow-sm">
          {isYouTube ? (
            <>
              <YoutubeLogo size={13} weight="fill" className="text-red-500" />
              <span>YOUTUBE</span>
            </>
          ) : (
            <span>{domain}</span>
          )}
        </div>

        {/* Quick action buttons on card hover */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 rounded-lg bg-black/75 backdrop-blur-md text-white hover:text-[#d97757] border border-white/10 transition-colors shadow-sm"
            title="Copy URL"
          >
            {copied ? (
              <Check size={13} weight="bold" className="text-emerald-400" />
            ) : (
              <Copy size={13} />
            )}
          </button>
        </div>
      </div>

      {/* Metadata Row (Deck style: Avatar + Title & Details) */}
      <div className="flex items-start gap-3 mt-3 px-1">
        {/* Source Avatar Circle */}
        <div className="w-9 h-9 rounded-full bg-[#201e1b] border border-[#2f2c27] flex items-center justify-center text-xs font-mono font-bold text-[#f5f4ef] flex-shrink-0 mt-0.5 group-hover:border-[#d97757]/40 transition-colors">
          {isYouTube ? (
            <YoutubeLogo size={18} weight="fill" className="text-red-500" />
          ) : (
            channelName.charAt(0).toUpperCase()
          )}
        </div>

        {/* Title, Channel, and Stats */}
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-sm sm:text-[15px] text-[#f5f4ef] line-clamp-2 leading-snug group-hover:text-[#d97757] transition-colors">
            {link.title}
          </h3>

          <div className="flex items-center gap-1.5 mt-1 text-xs text-[#9e9b91]">
            <span className="truncate max-w-[22ch] hover:text-[#f5f4ef] transition-colors">
              {channelName}
            </span>
            <CheckCircle size={12} weight="fill" className="text-[#9e9b91]/70 flex-shrink-0" />
          </div>

          <div className="flex items-center gap-2 mt-0.5 text-[11px] font-mono text-[#9e9b91]/70">
            <span>{formattedDate}</span>
            {link.tags[0] && (
              <>
                <span>•</span>
                <span className="text-[#d97757]/80">#{link.tags[0]}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
