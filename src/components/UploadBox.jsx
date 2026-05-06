import { UploadCloud } from "lucide-react";

export default function UploadBox({ label, file, onChange }) {
  return (
    <label className="glass-panel flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-500/40 p-6 text-center hover:border-indigo-400/40">
      <UploadCloud size={24} className="text-slate-300" />
      <p className="mt-2 text-sm text-white">{label}</p>
      <p className="mt-1 text-xs text-slate-400">
        {file?.name || "Drop CSV file here or click to choose"}
      </p>
      <input type="file" accept=".csv" className="hidden" onChange={onChange} />
    </label>
  );
}
