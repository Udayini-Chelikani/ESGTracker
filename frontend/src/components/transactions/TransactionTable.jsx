import { formatAmount, formatDate, scoreColor, formatScore } from "../../utils/format.js";

export default function TransactionTable({ transactions }) {
  if (!transactions || transactions.length === 0) {
    return <p className="hint">No transactions yet.</p>;
  }

  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr style={{ borderBottom: "1px solid var(--navy)" }}>
          <Th>Date</Th>
          <Th>Beneficiary</Th>
          <Th>Sector</Th>
          <Th align="right">Amount</Th>
          <Th align="right">Score</Th>
          <Th>Flag</Th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((txn) => (
          <tr key={txn._id} style={{ borderBottom: "1px solid var(--line)" }}>
            <Td className="hint">{formatDate(txn.transactionDate || txn.createdAt)}</Td>
            <Td>
              <div>{txn.beneficiaryName}</div>
              {txn.remittanceInfo && (
                <div className="hint" style={{ fontSize: 12 }}>
                  {txn.remittanceInfo}
                </div>
              )}
            </Td>
            <Td className="hint">{txn.aiAnalysis?.sector || "—"}</Td>
            <Td align="right" className="tabular">
              {formatAmount(txn.amount, txn.currency)}
            </Td>
            <Td
              align="right"
              className="tabular"
              style={{ color: scoreColor(txn.weightedScore), fontWeight: 500 }}
            >
              {formatScore(txn.weightedScore)}
            </Td>
            <Td>
              {txn.isAnomaly && (
                <span style={{ color: "var(--gold)", fontSize: 13 }}>Anomaly</span>
              )}
              {txn.needsReview && !txn.isAnomaly && (
                <span style={{ color: "var(--gold-bright)", fontSize: 13 }}>Needs review</span>
              )}
            </Td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Th({ children, align = "left" }) {
  return (
    <th
      style={{
        textAlign: align,
        padding: "8px 8px",
        fontSize: 12,
        fontWeight: 500,
        color: "var(--text-muted)",
        fontFamily: "var(--font-mono)",
      }}
    >
      {children}
    </th>
  );
}

function Td({ children, align = "left", className = "", style = {} }) {
  return (
    <td
      className={className}
      style={{ textAlign: align, padding: "10px 8px", fontSize: 14, ...style }}
    >
      {children}
    </td>
  );
}
