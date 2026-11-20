import { z } from "zod";

// Defines the exact shape we require from Gemini's response.
// If Gemini's output doesn't match this, we reject it rather than
// silently trusting malformed data — the caller falls back to
// needsReview: true instead of a fabricated score.
const geminiResponseSchema = z.object({
  sector: z.string(),
  primaryCategory: z.enum(["E", "S", "G", "neutral"]),
  environmentalImpact: z.number().min(-1).max(1),
  socialImpact: z.number().min(-1).max(1),
  governanceImpact: z.number().min(-1).max(1),
  confidence: z.number().min(0).max(1),
  reasoning: z.string(),
  highRiskFlag: z.boolean().optional().default(false),
});

/**
 * Parses raw text returned by Gemini into a validated object.
 * Handles the common case where the model wraps JSON in ```json fences
 * even when responseMimeType is set to application/json.
 */
export function parseGeminiResponse(rawText) {
  const cleaned = rawText.replace(/```json|```/g, "").trim();

  let parsedJson;
  try {
    parsedJson = JSON.parse(cleaned);
  } catch (err) {
    throw new Error(`Gemini response is not valid JSON: ${err.message}`);
  }

  const result = geminiResponseSchema.safeParse(parsedJson);
  if (!result.success) {
    throw new Error(
      `Gemini response failed validation: ${result.error.message}`
    );
  }

  return result.data;
}
