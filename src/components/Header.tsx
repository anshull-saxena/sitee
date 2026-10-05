"use client";

import { useState } from "react";
import { Terminal, Copy, Check, Sparkle } from "@phosphor-icons/react";

interface HeaderProps {
  totalLinks: number;
  onOpenCliGuide: () => void;
}

export function Header({ totalLinks, onOpenCliGuide }: HeaderProps) {
  const [copiedCli, setCopiedCli] = useState(false);

  const handleCopyCmd = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText("node cli.mjs");
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#2e2b26] bg-[#121110]/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo / Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#d97757] to-[#b35335] flex items-center justify-center text-white font-mono font-bold text-sm shadow-sm">
            LF
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm sm:text-base tracking-tight text-[#f5f4ef]">
                LinkFlow
              </span>
              <span className="text-[11px] font-mono text-[#d97757] bg-[#d97757]/10 px-2 py-0.5 rounded-full border border-[#d97757]/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d97757] animate-pulse" />
                {totalLinks} {totalLinks === 1 ? "link" : "links"}
              </span>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick CLI Command button */}
          <button
            type="button"
            onClick={handleCopyCmd}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1a1918] hover:bg-[#242220] border border-[#2e2b26] text-xs font-mono text-[#9e9b91] hover:text-[#f5f4ef] transition-colors"
            title="Click to copy CLI command"
          >
            <Terminal size={14} className="text-[#d97757]" />
            <span>node cli.mjs</span>
            {copiedCli ? (
              <Check size={12} weight="bold" className="text-emerald-400" />
            ) : (
              <Copy size={12} />
            )}
          </button>

          {/* Open Guide Modal */}
          <button
            type="button"
            onClick={onOpenCliGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#242220] hover:bg-[#2d2a26] border border-[#33302b] text-xs font-medium text-[#f5f4ef] transition-colors active:scale-[0.98]"
          >
            <Sparkle size={14} weight="fill" className="text-[#d97757]" />
            <span>CLI Guide</span>
          </button>
        </div>
      </div>
    </header>
  );
}
