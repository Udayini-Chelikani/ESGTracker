import AnomalyCard from "./AnomalyCard.jsx";

export default function AnomalyFeed({ anomalies }) {
  if (!anomalies || anomalies.length === 0) {
    return <p className="hint">No anomalies flagged yet.</p>;
  }

  return (
    <div>
      {anomalies.map((txn) => (
        <AnomalyCard key={txn._id} transaction={txn} />
      ))}
    </div>
  );
}
