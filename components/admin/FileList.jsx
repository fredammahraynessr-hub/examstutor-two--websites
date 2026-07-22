import React from "react";
import { FileText, FileCode, FileQuestion, StickyNote, File, ScrollText } from "lucide-react";

const ICONS = {
  question_bank: FileQuestion,
  config: FileCode,
  note: StickyNote,
  document: FileText,
  log: ScrollText
};

export default function FileList({ files, selectedId, onSelect }) {
  if (!files || files.length === 0) {
    return (
      <div className="rounded-lg border border-[#0033FF]/40 bg-[#001133]/60 p-8 text-center text-sm text-white/40">
        No files yet. Create one to get started.
      </div>
    );
  }
  return (
    <div className="space-y-2">
      {files.map((f) => {
        const Icon = ICONS[f.file_type] || File;
        const active = f.id === selectedId;
        return (
          <button
            key={f.id}
            onClick={() => onSelect(f)}
            className={`flex w-full items-center gap-3 rounded-md border px-3 py-2 text-left transition-colors ${active ? "border-[#00CFFF] bg-[#0033FF]/20" : "border-[#0033FF]/30 bg-[#001133]/40 hover:border-[#00CFFF]/50"}`}
          >
            <Icon className="h-4 w-4 shrink-0 text-[#00CFFF]" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">{f.file_name}</p>
              <p className="truncate text-[10px] text-white/40">{f.file_path}</p>
            </div>
            <span className="shrink-0 text-[10px] font-bold text-[#FFD700]">v{f.version || 1}</span>
          </button>
        );
      })}
    </div>
  );
}