import Transaction from "../models/Transaction.js";

/**
 * GET /api/anomalies?limit=...
 * Recent flagged transactions across all clients, newest first —
 * powers the anomaly feed on the dashboard.
 */
export async function getAnomalies(req, res, next) {
  try {
    const { limit = 50 } = req.query;

    const anomalies = await Transaction.find({ isAnomaly: true })
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.json({ count: anomalies.length, anomalies });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/anomalies/needs-review
 * Transactions where Gemini classification failed or was low-confidence —
 * separate from ESG anomalies, these need a human to re-check them.
 */
export async function getNeedsReview(req, res, next) {
  try {
    const items = await Transaction.find({ needsReview: true }).sort({
      createdAt: -1,
    });
    res.json({ count: items.length, items });
  } catch (err) {
    next(err);
  }
}
