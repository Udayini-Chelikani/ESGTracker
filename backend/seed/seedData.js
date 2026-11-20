// Loads sampleTransactions.json and POSTs each one to the running backend,
// so they go through the real Gemini classification -> scoring -> anomaly
// pipeline. Run this AFTER `npm run dev` is already running in another
// terminal.
//
// Usage: npm run seed

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const API_BASE = process.env.API_BASE || "http://localhost:5000/api";

async function seed() {
  const filePath = path.join(__dirname, "sampleTransactions.json");
  const transactions = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  console.log(`[seed] Loading ${transactions.length} sample transactions...`);

  for (const txn of transactions) {
    try {
      const res = await fetch(`${API_BASE}/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(txn),
      });
      const data = await res.json();

      if (!res.ok) {
        console.error(`[seed] Failed: ${txn.beneficiaryName} ->`, data.error);
        continue;
      }

      console.log(
        `[seed] OK: ${txn.beneficiaryName} -> category=${data.transaction.aiAnalysis.primaryCategory}, score=${data.transaction.weightedScore.toFixed(3)}, anomaly=${data.transaction.isAnomaly}`
      );
    } catch (err) {
      console.error(`[seed] Error posting ${txn.beneficiaryName}:`, err.message);
    }
  }

  console.log("[seed] Done.");
}

seed();
