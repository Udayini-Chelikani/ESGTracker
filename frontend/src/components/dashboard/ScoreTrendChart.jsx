import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { formatDate } from "../../utils/format.js";

export default function ScoreTrendChart({ scoreHistory }) {
  if (!scoreHistory || scoreHistory.length === 0) {
    return <p className="hint">No score history yet.</p>;
  }

  const data = scoreHistory.map((snap) => ({
    ...snap,
    label: formatDate(snap.date),
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
        <CartesianGrid stroke="var(--line)" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontFamily: "IBM Plex Mono", fontSize: 11, fill: "var(--text-muted)" }}
          axisLine={{ stroke: "var(--line)" }}
          tickLine={false}
        />
        <YAxis
          domain={[-1, 1]}
          tick={{ fontFamily: "IBM Plex Mono", fontSize: 11, fill: "var(--text-muted)" }}
          axisLine={false}
          tickLine={false}
        />
        <ReferenceLine y={0} stroke="var(--line)" />
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
          formatter={(value) => value.toFixed(2)}
        />
        <Line
          type="monotone"
          dataKey="overall"
          stroke="var(--gold-bright)"
          strokeWidth={2}
          dot={{ r: 3, fill: "var(--gold-bright)" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
