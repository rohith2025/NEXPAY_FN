export default function Loader({ text = "Loading..." }) {
  return (
    <div className="glass-panel rounded-2xl p-8 text-center">
      <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-indigo-300 border-t-transparent" />
      <p className="mt-4 text-sm text-slate-300">{text}</p>
    </div>
  );
}
