import { useAnomalies } from "../hooks/useClientScore.js";
import AnomalyFeed from "../components/anomalies/AnomalyFeed.jsx";

export default function Anomalies() {
  const { anomalies, loading, error } = useAnomalies();

  return (
    <div className="main">
      <div className="page-header">
        <h1>Anomalies</h1>
        <p>
          Transactions flagged for unusual sectors, sharp score drops, or
          high-risk beneficiary language, newest first.
        </p>
      </div>

      {loading && <p className="hint">Loading…</p>}
      {error && <p className="error-text">{error}</p>}
      {!loading && !error && <AnomalyFeed anomalies={anomalies} />}
    </div>
  );
}
