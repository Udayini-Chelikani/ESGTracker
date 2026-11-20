import { useState } from "react";
import { Link } from "react-router-dom";
import TransactionForm from "../components/transactions/TransactionForm.jsx";
import CsvUpload from "../components/transactions/CsvUpload.jsx";
import { formatScore, scoreColor } from "../utils/format.js";

export default function AddTransaction() {
  const [lastResult, setLastResult] = useState(null);
  const [batchDone, setBatchDone] = useState(false);

  return (
    <div className="main">
      <div className="page-header">
        <h1>New transaction</h1>
        <p>
          Each submission is classified by Gemini, scored, and checked against
          the client's history for anomalies.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div>
          <p className="section-label">Manual entry</p>
          <TransactionForm onResult={setLastResult} />
        </div>

        <div>
          <p className="section-label">Batch upload</p>
          <CsvUpload onBatchResult={() => setBatchDone(true)} />
          {batchDone && (
            <p className="hint" style={{ marginTop: 10 }}>
              Batch complete. <Link to="/">View the client register</Link>.
            </p>
          )}
        </div>
      </div>

      {lastResult && (
        <div className="card" style={{ marginTop: 24 }}>
          <p className="section-label">Result</p>
          <p style={{ fontSize: 15 }}>
            Classified as <strong>{lastResult.transaction.aiAnalysis.sector}</strong>{" "}
            ({lastResult.transaction.aiAnalysis.primaryCategory}) — score{" "}
            <span
              className="tabular"
              style={{
                color: scoreColor(lastResult.transaction.weightedScore),
                fontWeight: 600,
              }}
            >
              {formatScore(lastResult.transaction.weightedScore)}
            </span>
          </p>
          <p className="hint">{lastResult.transaction.aiAnalysis.reasoning}</p>
          {lastResult.transaction.isAnomaly && (
            <p className="error-text">Flagged: {lastResult.transaction.anomalyReason}</p>
          )}
          <Link to={`/clients/${encodeURIComponent(lastResult.transaction.clientName)}`}>
            View {lastResult.transaction.clientName}'s profile
          </Link>
        </div>
      )}
    </div>
  );
}
