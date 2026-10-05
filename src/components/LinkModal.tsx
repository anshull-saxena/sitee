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
      if (e.key === "Escape") {
        onClose();
      }
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#1a1918] border border-[#2e2b26] rounded-2xl overflow-hidden shadow-2xl text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#121110]/80 backdrop-blur-md border border-white/10 text-[#9e9b91] hover:text-[#f5f4ef] hover:border-white/20 transition-colors"
        >
          <X size={18} weight="bold" />
        </button>

        {/* Thumbnail Preview */}
        <div className="relative aspect-[16/9] w-full bg-[#242220] border-b border-[#2e2b26] overflow-hidden">
          {link.thumbnail && !imgError ? (
            <Image
              src={link.thumbnail}
              alt={link.title}
              fill
              sizes="(max-width: 768px) 100vw, 672px"
              className="object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#1a1918] to-[#252321] text-[#9e9b91]">
              <Globe size={48} weight="thin" className="opacity-40 mb-3" />
              <span className="text-sm font-mono">{domain}</span>
            </div>
          )}

          <div className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1 rounded-full bg-[#121110]/85 backdrop-blur-md border border-white/10 text-xs font-mono text-[#f5f4ef]">
            <Globe size={13} weight="bold" className="text-[#d97757]" />
            <span>{domain}</span>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2
                id="modal-title"
                className="text-2xl font-semibold tracking-tight text-[#f5f4ef]"
              >
                {link.title}
              </h2>
              <p className="mt-1 text-xs font-mono text-[#9e9b91]">
                {link.url}
              </p>
            </div>
          </div>

          <p className="mt-4 text-base text-[#9e9b91] leading-relaxed">
            {link.description}
          </p>

          {/* Meta Details */}
          <div className="mt-6 flex flex-wrap items-center gap-4 py-4 border-y border-[#2e2b26] text-xs text-[#9e9b91]">
            <div className="flex items-center gap-1.5 font-mono">
              <CalendarBlank size={14} weight="regular" />
              <span>
                Added {new Date(link.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <TagIcon size={14} weight="regular" />
              {link.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[11px] bg-[#121110] text-[#f5f4ef] px-2 py-0.5 rounded-md border border-[#2e2b26]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#242220] hover:bg-[#2e2b26] text-[#f5f4ef] text-sm font-medium border border-[#33302b] transition-colors active:scale-[0.98]"
            >
              {copied ? (
                <>
                  <Check size={16} weight="bold" className="text-emerald-400" />
                  <span>Copied to clipboard</span>
                </>
              ) : (
                <>
                  <Copy size={16} weight="regular" />
                  <span>Copy URL</span>
                </>
              )}
            </button>

            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#d97757] hover:bg-[#c56545] text-white text-sm font-medium transition-colors active:scale-[0.98]"
            >
              <span>Visit Link</span>
              <ArrowUpRight size={16} weight="bold" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
