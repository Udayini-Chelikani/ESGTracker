import Transaction from "../models/Transaction.js";
import Client from "../models/Client.js";
import { classifyTransaction } from "../services/geminiService.js";
import { computeWeightedScore, updateClientRunningScore } from "../services/scoringService.js";
import { checkAnomaly } from "../services/anomalyService.js";

/**
 * POST /api/transactions
 * The full pipeline for a single transaction:
 *   1. find-or-create the client
 *   2. call Gemini (with cache) to classify the transaction
 *   3. compute the weighted ESG score
 *   4. run anomaly checks against the client's history
 *   5. save the enriched transaction
 *   6. update and save the client's running score
 */
export async function createTransaction(req, res, next) {
  try {
    const { clientName, beneficiaryName, remittanceInfo, amount, currency, transactionDate } = req.body;

    let client = await Client.findOne({ clientName });
    if (!client) {
      client = await Client.create({ clientName });
    }

    let aiAnalysis;
    let needsReview = false;

    try {
      aiAnalysis = await classifyTransaction({
        clientName,
        beneficiaryName,
        remittanceInfo,
        amount,
        currency,
      });
    } catch (err) {
      // Gemini failed or returned invalid JSON — don't fail the whole
      // request. Save the transaction as neutral/needs-review instead,
      // so the pipeline keeps working during a live demo even if a
      // single call to Gemini has a hiccup.
      console.error(`[gemini] classification failed for beneficiary "${beneficiaryName}":`, err.message);
      needsReview = true;
      aiAnalysis = {
        sector: "unknown",
        primaryCategory: "neutral",
        environmentalImpact: 0,
        socialImpact: 0,
        governanceImpact: 0,
        confidence: 0,
        reasoning: "AI classification failed; flagged for manual review.",
        highRiskFlag: false,
      };
    }

    const weightedScore = computeWeightedScore(aiAnalysis, amount);

    const { isAnomaly, anomalyReason } = checkAnomaly({
      client,
      aiAnalysis,
      weightedScore,
      amount,
    });

    const transaction = await Transaction.create({
      clientName,
      beneficiaryName,
      remittanceInfo,
      amount,
      currency,
      transactionDate: transactionDate ? new Date(transactionDate) : new Date(),
      aiAnalysis,
      weightedScore,
      isAnomaly,
      anomalyReason,
      needsReview,
    });

    updateClientRunningScore(client, aiAnalysis);
    if (isAnomaly) client.anomalyCount += 1;
    await client.save();

    res.status(201).json({ transaction, clientScore: client.runningScore });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/transactions?clientName=...&limit=...
 * List transactions, optionally filtered by client, newest first.
 */
export async function getTransactions(req, res, next) {
  try {
    const { clientName, limit = 50 } = req.query;
    const filter = clientName ? { clientName } : {};

    const transactions = await Transaction.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.json({ count: transactions.length, transactions });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/transactions/:id
 */
export async function getTransactionById(req, res, next) {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.json({ transaction });
  } catch (err) {
    next(err);
  }
}
