import { mean, stdDev } from "../utils/stats.js";

const RECENT_SCORES_WINDOW = 20; // how many recent scores to keep per client
const STD_DEV_THRESHOLD = 2; // flag if new score is this many std devs below average
const MIN_HISTORY_FOR_STATS = 5; // need at least this many past transactions before stats are meaningful

/**
 * Runs rule-based anomaly checks on a new transaction against the client's
 * history. Returns { isAnomaly, anomalyReason }. Mutates client.recentScores
 * to include the new score (caller saves the client doc).
 *
 * Deliberately rule-based rather than ML-based: explainable, fast, and
 * good enough for a hackathon demo. Swap in a proper model later if needed.
 */
export function checkAnomaly({ client, aiAnalysis, weightedScore, amount }) {
  const reasons = [];

  // 1. High-risk flag straight from Gemini (sanctions/shell company language etc.)
  if (aiAnalysis.highRiskFlag) {
    reasons.push("Beneficiary or remittance text matched high-risk indicators (possible sanctions/shell entity).");
  }

  // 2. Score drop vs client's recent history
  if (client.recentScores.length >= MIN_HISTORY_FOR_STATS) {
    const avg = mean(client.recentScores);
    const std = stdDev(client.recentScores);
    if (std > 0 && weightedScore < avg - STD_DEV_THRESHOLD * std) {
      reasons.push(
        `ESG score (${weightedScore.toFixed(2)}) is more than ${STD_DEV_THRESHOLD} standard deviations below this client's recent average (${avg.toFixed(2)}).`
      );
    }
  }

  // 3. New/unusual sector for this client
  const knownSectors = Array.from(client.sectorSpend.keys());
  if (knownSectors.length >= MIN_HISTORY_FOR_STATS && !knownSectors.includes(aiAnalysis.sector)) {
    reasons.push(
      `Payment to a sector ("${aiAnalysis.sector}") this client has not paid into before.`
    );
  }

  // 4. Very low confidence classification — not itself an ESG anomaly,
  // but worth surfacing so a human reviews it.
  if (aiAnalysis.confidence < 0.3) {
    reasons.push("Low-confidence AI classification — recommend manual review.");
  }

  // Maintain rolling window of recent scores for future stats checks
  client.recentScores.push(weightedScore);
  if (client.recentScores.length > RECENT_SCORES_WINDOW) {
    client.recentScores.shift();
  }

  return {
    isAnomaly: reasons.length > 0,
    anomalyReason: reasons.join(" "),
  };
}
