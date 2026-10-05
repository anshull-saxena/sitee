"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  X,
  ArrowUpRight,
  Copy,
  Check,
  Globe,
  CalendarBlank,
  Tag as TagIcon,
  YoutubeLogo,
} from "@phosphor-icons/react";
import type { LinkItem } from "@/types/link";

interface LinkModalProps {
  link: LinkItem | null;
  onClose: () => void;
}

export function LinkModal({ link, onClose }: LinkModalProps) {
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (link) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [link, onClose]);

  if (!link) return null;

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

  const ytId =
    link.youtubeId ||
    (() => {
      const match = link.url.match(
        /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
      );
      return match && match[2].length === 11 ? match[2] : null;
    })();

  const handleCopy = () => {
    navigator.clipboard.writeText(link.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-[#171615] border border-[#282623] rounded-2xl overflow-hidden shadow-2xl text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[#9e9b91] hover:text-[#f5f4ef] transition-colors"
        >
          <X size={18} weight="bold" />
        </button>

        {/* Media Header: YouTube Embed or Image Preview */}
        <div className="relative aspect-video w-full bg-[#121110] border-b border-[#282623] overflow-hidden">
          {isYouTube && ytId ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0`}
              title={link.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : link.thumbnail && !imgError ? (
            <Image
              src={link.thumbnail}
              alt={link.title}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#171615] to-[#201e1b] text-[#9e9b91]">
              <Globe size={48} weight="thin" className="opacity-40 mb-3" />
              <span className="text-sm font-mono">{domain}</span>
            </div>
          )}

          {/* Domain badge on top-left */}
          {!isYouTube && (
            <div className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/10 text-xs font-mono text-[#f5f4ef]">
              <Globe size={13} weight="bold" className="text-[#d97757]" />
              <span>{domain}</span>
            </div>
          )}
        </div>

        {/* Content details */}
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                {isYouTube ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-mono">
                    <YoutubeLogo size={14} weight="fill" />
                    <span>YouTube Video</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#d97757]/10 text-[#d97757] border border-[#d97757]/20 text-xs font-mono">
                    <Globe size={14} />
                    <span>Web Resource</span>
                  </span>
                )}
                {link.author && (
                  <span className="text-xs text-[#9e9b91]">by {link.author}</span>
                )}
              </div>

              <h2
                id="modal-title"
                className="text-xl sm:text-2xl font-semibold tracking-tight text-[#f5f4ef]"
              >
                {link.title}
              </h2>
            </div>
          </div>

          <p className="mt-3 text-sm sm:text-base text-[#9e9b91] leading-relaxed">
            {link.description}
          </p>

          {/* Meta Details */}
          <div className="mt-5 flex flex-wrap items-center gap-4 py-3.5 border-y border-[#282623] text-xs text-[#9e9b91]">
            <div className="flex items-center gap-1.5 font-mono">
              <CalendarBlank size={14} />
              <span>
                Added {new Date(link.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <TagIcon size={14} />
              {link.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[11px] bg-[#121110] text-[#f5f4ef] px-2 py-0.5 rounded-md border border-[#282623]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-5 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#201e1b] hover:bg-[#282623] text-[#f5f4ef] text-sm font-medium border border-[#2f2c27] transition-colors"
            >
              {copied ? (
                <>
                  <Check size={16} weight="bold" className="text-emerald-400" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy size={16} />
                  <span>Copy Link</span>
                </>
              )}
            </button>

            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#d97757] hover:bg-[#c56545] text-white text-sm font-medium transition-colors"
            >
              <span>{isYouTube ? "Watch on YouTube" : "Open Link"}</span>
              <ArrowUpRight size={16} weight="bold" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
