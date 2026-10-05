"use client";

import { useEffect, useState } from "react";
import { X, Terminal, Copy, Check, Sparkle, ArrowRight } from "@phosphor-icons/react";

interface CliGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CliGuideModal({ isOpen, onClose }: CliGuideModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText("node cli.mjs");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cli-guide-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-[#1a1918] border border-[#2e2b26] rounded-2xl p-6 sm:p-7 shadow-2xl text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 p-2 rounded-full bg-[#121110] border border-[#2e2b26] text-[#9e9b91] hover:text-[#f5f4ef] transition-colors"
        >
          <X size={16} weight="bold" />
        </button>

        <div className="flex items-center gap-2 text-[#d97757] text-xs font-mono mb-2">
          <Terminal size={16} weight="bold" />
          <span>ANIMATED CLI INTEGRATION</span>
        </div>

        <h2
          id="cli-guide-title"
          className="text-xl sm:text-2xl font-semibold text-[#f5f4ef] tracking-tight"
        >
          Add links and push to Vercel
        </h2>

        <p className="mt-2 text-sm text-[#9e9b91] leading-relaxed">
          The included terminal CLI allows you to append any number of links with automatic metadata extraction, custom thumbnails, and instant deployment.
        </p>

        {/* Command Box */}
        <div className="mt-5 p-3.5 rounded-xl bg-[#121110] border border-[#2e2b26] flex items-center justify-between gap-3">
          <div className="font-mono text-sm text-[#f5f4ef] flex items-center gap-2">
            <span className="text-[#d97757] select-none">$</span>
            <code>node cli.mjs</code>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#242220] hover:bg-[#2d2a26] text-xs font-mono text-[#f5f4ef] border border-[#33302b] transition-colors"
          >
            {copied ? (
              <>
                <Check size={14} className="text-emerald-400" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Feature bullets */}
        <div className="mt-6 space-y-3 text-xs text-[#9e9b91]">
          <div className="flex items-start gap-2.5">
            <Sparkle size={16} className="text-[#d97757] mt-0.5 flex-shrink-0" />
            <div>
              <strong className="text-[#f5f4ef] font-medium block">Automatic OpenGraph Scraping</strong>
              Enter any URL and the CLI automatically fetches title, description, and preview image.
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <ArrowRight size={16} className="text-[#d97757] mt-0.5 flex-shrink-0" />
            <div>
              <strong className="text-[#f5f4ef] font-medium block">Thumbnails via URL or Local File</strong>
              Provide an image URL or specify a local file path. Local files are automatically copied into the site public directory.
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Terminal size={16} className="text-[#d97757] mt-0.5 flex-shrink-0" />
            <div>
              <strong className="text-[#f5f4ef] font-medium block">Direct Vercel Deploy & Git Push</strong>
              Once you finish adding links, the CLI prompts to deploy directly via Vercel CLI or commit and push to Git.
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[#2e2b26] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#242220] hover:bg-[#2d2a26] text-sm text-[#f5f4ef] border border-[#33302b] transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
