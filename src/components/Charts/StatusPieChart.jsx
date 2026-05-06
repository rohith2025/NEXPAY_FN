import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function StatusPieChart({ stats }) {
  const data = [
    { name: "Verified", value: stats?.verified || 0 },
    { name: "Partial", value: stats?.partial || 0 },
    { name: "Not Verified", value: stats?.notVerified || 0 },
    { name: "Suspicious", value: stats?.suspicious || 0 }
  ];
  return (
    <div className="glass-panel rounded-2xl p-4">
      <p className="mb-3 text-sm text-slate-300">Verification Split</p>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={data} dataKey="value" cx="50%" cy="50%" outerRadius={80}>
            {data.map((entry, i) => (
              <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
