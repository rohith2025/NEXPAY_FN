import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function TrendLineChart({ data }) {
  return (
    <div className="glass-panel rounded-2xl p-4">
      <p className="mb-3 text-sm text-slate-300">Queue Trend</p>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <XAxis dataKey="name" stroke="#64748b" />
          <YAxis stroke="#64748b" />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#818cf8" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
