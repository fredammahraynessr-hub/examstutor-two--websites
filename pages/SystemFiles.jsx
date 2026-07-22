import React, { useState, useEffect } from "react";
import { Plus, Loader2, ShieldCheck, RefreshCw } from "lucide-react";
import { base44 } from "@/api/base44Client";
import StarField from "@/components/examstutor/StarField";
import TopBar from "@/components/examstutor/TopBar";
import FooterHUD from "@/components/examstutor/FooterHUD";
import FileList from "@/components/admin/FileList";
import FileEditor from "@/components/admin/FileEditor";

export default function SystemFiles() {
  const [files, setFiles] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPath, setNewPath] = useState("");
  const [newType, setNewType] = useState("document");
  const [integrity, setIntegrity] = useState(null);
  const [checkingIntegrity, setCheckingIntegrity] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await base44.functions.invoke("manageSystemFiles", { action: "list" });
      setFiles(res.data.files);
    } catch (e) {} finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const createFile = async () => {
    if (!newName || !newPath) return;
    try {
      const res = await base44.functions.invoke("manageSystemFiles", {
        action: "save", file_name: newName, file_path: newPath, content: "", file_type: newType
      });
      setSelected(res.data.file);
      setCreating(false);
      setNewName(""); setNewPath("");
      await load();
    } catch (e) {}
  };

  const runIntegrityCheck = async () => {
    setCheckingIntegrity(true);
    try {
      const res = await base44.functions.invoke("manageSystemFiles", { action: "integrity_check" });
      setIntegrity(res.data);
    } catch (e) {} finally { setCheckingIntegrity(false); }
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-black font-body text-white">
      <StarField />
      <TopBar />
      <main className="relative z-10 mx-auto w-full max-w-[1280px] px-4 pb-28 pt-24">
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-3xl font-black text-white">System <span className="text-[#00CFFF]">Files</span></h1>
          <div className="flex gap-2">
            <button onClick={runIntegrityCheck} disabled={checkingIntegrity} className="flex items-center gap-2 rounded-md border border-[#FFD700]/40 px-3 py-1.5 text-xs font-bold text-[#FFD700] hover:bg-[#FFD700]/10 disabled:opacity-50">
              {checkingIntegrity ? <Loader2 className="h-3 w-3 animate-spin" /> : <ShieldCheck className="h-3 w-3" />} Integrity Check
            </button>
            <button onClick={() => setCreating(!creating)} className="flex items-center gap-2 rounded-md bg-[#FFD700] px-3 py-1.5 text-xs font-bold text-black transition-transform hover:scale-105">
              <Plus className="h-3 w-3" /> New File
            </button>
          </div>
        </div>

        {integrity && (
          <div className="mt-4 rounded-lg border border-[#0033FF]/40 bg-[#001133]/60 px-4 py-3 text-sm">
            <span className="font-bold text-white">Integrity: </span>
            <span className={integrity.mismatches === 0 ? "text-green-400" : "text-red-400"}>
              {integrity.verified}/{integrity.total} verified{integrity.mismatches > 0 ? `, ${integrity.mismatches} mismatched` : ""}
            </span>
          </div>
        )}

        {creating && (
          <div className="mt-4 flex flex-wrap gap-2 rounded-lg border border-[#00CFFF]/40 bg-[#001133]/60 p-4">
            <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="File name" className="flex-1 rounded border border-[#0033FF]/40 bg-black/40 px-3 py-1.5 text-sm text-white outline-none focus:border-[#00CFFF]" />
            <input value={newPath} onChange={(e) => setNewPath(e.target.value)} placeholder="Path (e.g. /configs/app.json)" className="flex-1 rounded border border-[#0033FF]/40 bg-black/40 px-3 py-1.5 text-sm text-white outline-none focus:border-[#00CFFF]" />
            <select value={newType} onChange={(e) => setNewType(e.target.value)} className="rounded border border-[#0033FF]/40 bg-black/40 px-3 py-1.5 text-sm text-white outline-none">
              <option value="document">Document</option>
              <option value="config">Config</option>
              <option value="note">Note</option>
              <option value="question_bank">Question Bank</option>
              <option value="log">Log</option>
            </select>
            <button onClick={createFile} className="rounded bg-[#00CFFF] px-4 py-1.5 text-sm font-bold text-black">Create</button>
          </div>
        )}

        {loading ? (
          <div className="mt-20 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-[#00CFFF]" /></div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-bold text-white/50">FILES ({files.length})</span>
                <button onClick={load}><RefreshCw className="h-3 w-3 text-white/40 hover:text-[#00CFFF]" /></button>
              </div>
              <FileList files={files} selectedId={selected?.id} onSelect={setSelected} />
            </div>
            <div className="min-h-[500px] rounded-lg border border-[#0033FF]/40 bg-[#001133]/40 p-4">
              <FileEditor file={selected} onSaved={(f) => { setSelected(f); load(); }} />
            </div>
          </div>
        )}
      </main>
      <FooterHUD />
    </div>
  );
}