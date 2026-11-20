// How much weight a single new transaction has on the client's running
// average. Higher = more reactive to recent transactions, lower = smoother
// but slower to reflect change. 0.2 means the last transaction contributes
// 20% to the new running score.
const EWMA_ALPHA = 0.2;

// Cap on how much a single transaction's amount can dominate the score,
// so one enormous payment doesn't single-handedly define a client's ESG
// profile. Amounts above this are treated as if they were this amount.
const AMOUNT_NORMALIZATION_CAP = 10_000_000; // e.g. 1 crore INR

/**
 * Converts an amount into a 0–1 weight, capped so very large transactions
 * don't completely dominate the score.
 */
function normalizeAmount(amount) {
  const capped = Math.min(amount, AMOUNT_NORMALIZATION_CAP);
  return capped / AMOUNT_NORMALIZATION_CAP;
}

/**
 * Computes a single transaction's weighted ESG score.
 * Averages the three E/S/G impact values, then scales by how large the
 * transaction is (bigger payments should move the needle more) and by
 * the model's confidence (low-confidence guesses should matter less).
 */
export function computeWeightedScore(aiAnalysis, amount) {
  const { environmentalImpact, socialImpact, governanceImpact, confidence } =
    aiAnalysis;

  const avgImpact = (environmentalImpact + socialImpact + governanceImpact) / 3;
  const amountWeight = normalizeAmount(amount);

  return avgImpact * amountWeight * confidence;
}

/**
 * Exponentially-weighted moving average — blends the old score with the
 * new one so recent transactions matter more without one outlier causing
 * a wild swing.
 */
function ewma(oldValue, newValue, alpha = EWMA_ALPHA) {
  return oldValue * (1 - alpha) + newValue * alpha;
}

/**
 * Updates a client document's running E/S/G/overall scores given a new
 * transaction's AI analysis. Mutates and returns the client doc
 * (caller is responsible for calling .save()).
 */
export function updateClientRunningScore(client, aiAnalysis) {
  client.runningScore.E = ewma(client.runningScore.E, aiAnalysis.environmentalImpact);
  client.runningScore.S = ewma(client.runningScore.S, aiAnalysis.socialImpact);
  client.runningScore.G = ewma(client.runningScore.G, aiAnalysis.governanceImpact);
  client.runningScore.overall = ewma(
    client.runningScore.overall,
    (aiAnalysis.environmentalImpact + aiAnalysis.socialImpact + aiAnalysis.governanceImpact) / 3
  );

  client.transactionCount += 1;

  // Track sector spend for anomaly detection (sector-shift checks)
  const currentSectorSpend = client.sectorSpend.get(aiAnalysis.sector) || 0;
  client.sectorSpend.set(aiAnalysis.sector, currentSectorSpend + 1);

  // Snapshot the score so the dashboard can chart it over time.
  // For a hackathon demo you may want to snapshot every transaction;
  // for production, snapshot on a schedule (e.g. daily) instead.
  client.scoreHistory.push({
    date: new Date(),
    E: client.runningScore.E,
    S: client.runningScore.S,
    G: client.runningScore.G,
    overall: client.runningScore.overall,
  });

  return client;
}
