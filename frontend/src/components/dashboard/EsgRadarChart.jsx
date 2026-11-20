import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

export default function EsgRadarChart({ runningScore }) {
  const data = [
    { axis: "Environmental", value: runningScore.E },
    { axis: "Social", value: runningScore.S },
    { axis: "Governance", value: runningScore.G },
  ];

  return (
    <ResponsiveContainer width="100%" height={260}>
      <RadarChart data={data} outerRadius="75%">
        <PolarGrid stroke="var(--line)" />
        <PolarAngleAxis
          dataKey="axis"
          tick={{ fontFamily: "IBM Plex Sans", fontSize: 12, fill: "var(--text-muted)" }}
        />
        <PolarRadiusAxis domain={[-1, 1]} tick={false} axisLine={false} />
        <Radar
          dataKey="value"
          stroke="var(--gold-bright)"
          fill="var(--gold-bright)"
          fillOpacity={0.25}
          strokeWidth={2}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
