import { useMemo } from "react";
import { useClients } from "../hooks/useClientScore.js";
import ClientScoreCard from "../components/dashboard/ClientScoreCard.jsx";

export default function Dashboard() {
  const { clients, loading, error } = useClients();

  const sorted = useMemo(
    () => [...clients].sort((a, b) => a.runningScore.overall - b.runningScore.overall),
    [clients]
  );

  return (
    <div className="main">
      <div className="page-header">
        <h1>Client register</h1>
        <p>
          Running ESG scores derived from payment data, weighted by transaction
          size and updated as new payments arrive. Lowest scores are listed first.
        </p>
      </div>

      {loading && <p className="hint">Loading clients…</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && sorted.length === 0 && (
        <div className="card">
          <p className="hint">
            No clients yet. Submit a transaction to get started, or run the
            backend seed script for demo data.
          </p>
        </div>
      )}

      {!loading && sorted.length > 0 && (
        <div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto auto auto",
              gap: 24,
              padding: "0 4px 8px",
              borderBottom: "1px solid var(--navy)",
            }}
          >
            <span className="section-label">Client</span>
            <span className="section-label">E / S / G</span>
            <span className="section-label" style={{ textAlign: "right" }}>
              Overall
            </span>
            <span />
          </div>
          {sorted.map((client) => (
            <ClientScoreCard key={client._id} client={client} />
          ))}
        </div>
      )}
    </div>
  );
}
