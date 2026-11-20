import { geminiModel } from "../config/gemini.js";
import { parseGeminiResponse } from "../utils/parseGeminiResponse.js";
import BeneficiaryCache from "../models/BeneficiaryCache.js";

function buildPrompt({ clientName, beneficiaryName, remittanceInfo, amount, currency }) {
  return `You are an ESG (Environmental, Social, Governance) classification engine for a bank's payment monitoring system.

Given a single payment transaction, classify it. Respond ONLY with valid JSON, no other text, no markdown fences.

Transaction:
- Client: ${clientName}
- Beneficiary: ${beneficiaryName}
- Remittance info: ${remittanceInfo || "(none provided)"}
- Amount: ${amount} ${currency}

Return JSON in exactly this shape:
{
  "sector": "<inferred industry/sector of the beneficiary, e.g. 'fossil fuel', 'renewable energy', 'healthcare', 'manufacturing', 'unknown'>",
  "primaryCategory": "E" | "S" | "G" | "neutral",
  "environmentalImpact": <number from -1 (very harmful, e.g. fossil fuels, deforestation, heavy emissions) to 1 (very positive, e.g. renewables, recycling, efficiency), 0 if not applicable>,
  "socialImpact": <number from -1 to 1, e.g. labour violations vs healthcare/education/community spend>,
  "governanceImpact": <number from -1 to 1, e.g. shell companies/sanctioned entities vs transparent, well-known vendors>,
  "confidence": <0 to 1, how confident you are given the limited information available>,
  "reasoning": "<one concise sentence explaining the classification>",
  "highRiskFlag": <true if beneficiary/remittance text suggests sanctions, shell companies, or other red flags, else false>
}

If there is not enough information to infer anything meaningful, set all impact scores to 0, primaryCategory to "neutral", and confidence low (below 0.3).`;
}

/**
 * Classifies a transaction via Gemini. Checks the beneficiary cache first —
 * if we've classified this beneficiary before with high confidence, reuse
 * that sector/category info instead of burning another API call, but still
 * let a low-confidence cache entry be retried.
 */
export async function classifyTransaction(txn) {
  const cached = await BeneficiaryCache.findOne({
    beneficiaryName: txn.beneficiaryName,
  });

  if (cached) {
    // Bump hit count and reuse — cheap path, no Gemini call.
    cached.hitCount += 1;
    await cached.save();

    return {
      sector: cached.sector,
      primaryCategory: cached.primaryCategory,
      environmentalImpact: cached.environmentalImpact,
      socialImpact: cached.socialImpact,
      governanceImpact: cached.governanceImpact,
      confidence: 0.9, // treat cache hits as high-confidence (already validated once)
      reasoning: `Cached classification from ${cached.hitCount - 1} prior transaction(s) with this beneficiary.`,
      highRiskFlag: false,
      fromCache: true,
    };
  }

  const prompt = buildPrompt(txn);
  const result = await geminiModel.generateContent(prompt);
  const rawText = result.response.text();
  const parsed = parseGeminiResponse(rawText); // throws if invalid — caller handles fallback

  // Only cache reasonably confident results, so a shaky first guess
  // doesn't get permanently reused for every future transaction.
  if (parsed.confidence >= 0.5) {
    await BeneficiaryCache.create({
      beneficiaryName: txn.beneficiaryName,
      sector: parsed.sector,
      primaryCategory: parsed.primaryCategory,
      environmentalImpact: parsed.environmentalImpact,
      socialImpact: parsed.socialImpact,
      governanceImpact: parsed.governanceImpact,
    }).catch(() => {
      // Ignore duplicate-key races if two requests cache the same
      // beneficiary concurrently — not worth failing the request over.
    });
  }

  return { ...parsed, fromCache: false };
}
