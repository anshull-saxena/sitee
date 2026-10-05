import { Terminal, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[#2e2b26] bg-[#121110] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#9e9b91]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Deployed on Vercel Edge</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <Terminal size={14} className="text-[#d97757]" />
            <span>Updated via animated CLI</span>
          </span>
          <span className="text-[#2e2b26]">•</span>
          <a
            href="https://vercel.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#f5f4ef] flex items-center gap-1 transition-colors"
          >
            <span>Vercel</span>
            <ArrowUpRight size={12} />
          </a>
        </div>
      </div>
    </footer>
  );
}
