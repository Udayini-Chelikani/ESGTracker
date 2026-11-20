import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function SectorBreakdownChart({ sectorSpend }) {
  const entries = Object.entries(sectorSpend || {});
  if (entries.length === 0) {
    return <p className="hint">No sector data yet.</p>;
  }

  const data = entries
    .map(([sector, count]) => ({ sector, count }))
    .sort((a, b) => b.count - a.count);

  return (
    <ResponsiveContainer width="100%" height={Math.max(160, data.length * 36)}>
      <BarChart data={data} layout="vertical" margin={{ left: 16 }}>
        <CartesianGrid stroke="var(--line)" horizontal={false} />
        <XAxis
          type="number"
          tick={{ fontFamily: "IBM Plex Mono", fontSize: 11, fill: "var(--text-muted)" }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <YAxis
          dataKey="sector"
          type="category"
          width={140}
          tick={{ fontFamily: "IBM Plex Sans", fontSize: 12, fill: "var(--text)" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            fontFamily: "IBM Plex Sans",
            fontSize: 13,
            background: "var(--ink)",
            border: "1px solid var(--navy)",
            borderRadius: 0,
            color: "var(--text)",
          }}
          labelStyle={{ color: "var(--text)" }}
        />
        <Bar dataKey="count" fill="var(--gold-bright)" barSize={16} />
      </BarChart>
    </ResponsiveContainer>
  );
}
