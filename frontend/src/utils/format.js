// Maps an ESG score (-1 to 1) to a color from the design palette.
// Scores are rarely near the extremes in practice, so the thresholds
// are tuned to the EWMA-smoothed range the scoring service produces.
export function scoreColor(score) {
  if (score > 0.05) return "var(--navy-light)";
  if (score < -0.05) return "var(--gold)";
  return "var(--text-muted)";
}

export function formatScore(score) {
  if (score === undefined || score === null) return "—";
  const sign = score > 0 ? "+" : "";
  return `${sign}${score.toFixed(2)}`;
}

export function formatAmount(amount, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
