import { Link } from "react-router-dom";
import { formatAmount, formatDate } from "../../utils/format.js";

export default function AnomalyCard({ transaction }) {
  return (
    <div
      className="card"
      style={{ borderLeft: "3px solid var(--gold)", marginBottom: 12 }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
        <div>
          <Link
            to={`/clients/${encodeURIComponent(transaction.clientName)}`}
            style={{ fontWeight: 500, textDecoration: "none" }}
          >
            {transaction.clientName}
          </Link>
          <div className="hint" style={{ marginTop: 2 }}>
            paid {transaction.beneficiaryName}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="tabular">
            {formatAmount(transaction.amount, transaction.currency)}
          </div>
          <div className="hint">{formatDate(transaction.transactionDate || transaction.createdAt)}</div>
        </div>
      </div>

      <p style={{ margin: "12px 0 0", fontSize: 14, color: "var(--gold)" }}>
        {transaction.anomalyReason}
      </p>
    </div>
  );
}
