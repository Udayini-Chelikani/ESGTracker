import { useParams } from "react-router-dom";
import { useClientDetail } from "../hooks/useClientScore.js";
import EsgRadarChart from "../components/dashboard/EsgRadarChart.jsx";
import ScoreTrendChart from "../components/dashboard/ScoreTrendChart.jsx";
import SectorBreakdownChart from "../components/dashboard/SectorBreakdownChart.jsx";
import TransactionTable from "../components/transactions/TransactionTable.jsx";
import { formatScore, scoreColor } from "../utils/format.js";

export default function ClientDetail() {
  const { clientName } = useParams();
  const { client, transactions, loading, error } = useClientDetail(clientName);

  if (loading) return <div className="main"><p className="hint">Loading…</p></div>;
  if (error) return <div className="main"><p className="error-text">{error}</p></div>;
  if (!client) return null;

  return (
    <div className="main">
      <div className="page-header">
        <h1>{client.clientName}</h1>
        <p>
          {client.transactionCount} transaction{client.transactionCount === 1 ? "" : "s"} recorded
          {client.anomalyCount > 0 && `, ${client.anomalyCount} flagged for review`}.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        <div className="card">
          <p className="section-label">Overall score</p>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 48,
              color: scoreColor(client.runningScore.overall),
            }}
          >
            {formatScore(client.runningScore.overall)}
          </div>
          <EsgRadarChart runningScore={client.runningScore} />
        </div>

        <div className="card">
          <p className="section-label">Score over time</p>
          <ScoreTrendChart scoreHistory={client.scoreHistory} />
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <p className="section-label">Spend by sector</p>
        <SectorBreakdownChart sectorSpend={client.sectorSpend} />
      </div>

      <div className="card">
        <p className="section-label">Transaction history</p>
        <TransactionTable transactions={transactions} />
      </div>
    </div>
  );
}
