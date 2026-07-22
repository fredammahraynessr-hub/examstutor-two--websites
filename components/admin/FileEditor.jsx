import React, { useState, useEffect, useRef } from "react";
import { Loader2, Check, ShieldX } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function FileEditor({ file, onSaved }) {
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (file) { setContent(file.content || ""); setStatus("idle"); setError(null); }
  }, [file?.id]);

  useEffect(() => {
    if (!file || content === (file.content || "")) return;
    setStatus("saving");
    setError(null);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await base44.functions.invoke("manageSystemFiles", {
          action: "save", file_id: file.id, file_name: file.file_name,
          file_path: file.file_path, content, file_type: file.file_type
        });
        setStatus("saved");
        onSaved?.(res.data.file);
      } catch (e) {
        setStatus("error");
        setError(e.response?.data?.error || "Save failed");
      }
    }, 2000);
    return () => clearTimeout(debounceRef.current);
  }, [content]);

  if (!file) {
    return <div className="flex h-full items-center justify-center text-sm text-white/30">Select a file to edit</div>;
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-[#0033FF]/30 pb-2">
        <div>
          <p className="text-sm font-bold text-white">{file.file_name}</p>
          <p className="text-[10px] text-white/40">{file.file_path} · v{file.version} · {file.size_bytes || 0}B</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold">
          {status === "saving" && <><Loader2 className="h-3 w-3 animate-spin text-[#00CFFF]" /><span className="text-[#00CFFF]">Saving…</span></>}
          {status === "saved" && <><Check className="h-3 w-3 text-green-400" /><span className="text-green-400">Saved</span></>}
          {status === "error" && <><ShieldX className="h-3 w-3 text-red-400" /><span className="text-red-400">Blocked</span></>}
          {status === "idle" && <span className="text-white/30">Autosave on</span>}
        </div>
      </div>
      {error && <p className="mt-2 rounded bg-red-500/10 px-2 py-1 text-xs text-red-400">{error}</p>}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="mt-2 flex-1 resize-none rounded-md border border-[#0033FF]/30 bg-black/40 p-3 font-mono text-xs text-white/90 outline-none focus:border-[#00CFFF]"
        placeholder="Start typing… changes autosave after 2 seconds."
      />
    </div>
  );
}