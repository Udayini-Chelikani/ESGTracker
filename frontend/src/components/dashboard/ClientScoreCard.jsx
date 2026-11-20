import { Link } from "react-router-dom";
import { scoreColor, formatScore } from "../../utils/format.js";

// Renders one client as a horizontal ledger row: name, transaction count,
// an inline E/S/G bar, and the overall score. Worst scores are meant to
// be sorted to the top by the caller so the most urgent clients read first.
export default function ClientScoreCard({ client }) {
  const { clientName, runningScore, transactionCount, anomalyCount } = client;

  return (
    <Link
      to={`/clients/${encodeURIComponent(clientName)}`}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto auto auto",
        gap: 24,
        alignItems: "center",
        padding: "16px 4px",
        borderBottom: "1px solid var(--line)",
        textDecoration: "none",
        color: "var(--text)",
      }}
    >
      <div>
        <div style={{ fontWeight: 500 }}>{clientName}</div>
        <div className="hint tabular">
          {transactionCount} transaction{transactionCount === 1 ? "" : "s"}
          {anomalyCount > 0 && (
            <span style={{ color: "var(--gold)" }}>
              {" "}
              · {anomalyCount} flagged
            </span>
          )}
        </div>
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <ScorePip label="E" value={runningScore.E} />
        <ScorePip label="S" value={runningScore.S} />
        <ScorePip label="G" value={runningScore.G} />
      </div>

      <div
        className="tabular"
        style={{
          minWidth: 56,
          textAlign: "right",
          color: scoreColor(runningScore.overall),
          fontWeight: 600,
        }}
      >
        {formatScore(runningScore.overall)}
      </div>

      <div style={{ color: "var(--text-muted)", fontSize: 13 }}>View</div>
    </Link>
  );
}

function ScorePip({ label, value }) {
  return (
    <div style={{ textAlign: "center", width: 34 }}>
      <div className="hint" style={{ fontSize: 11 }}>
        {label}
      </div>
      <div
        className="tabular"
        style={{ fontSize: 13, color: scoreColor(value), fontWeight: 500 }}
      >
        {formatScore(value)}
      </div>
    </div>
  );
}
