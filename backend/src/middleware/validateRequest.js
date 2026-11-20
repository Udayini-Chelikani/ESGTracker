import { z } from "zod";

export const transactionInputSchema = z.object({
  clientName: z.string().min(1, "clientName is required"),
  beneficiaryName: z.string().min(1, "beneficiaryName is required"),
  remittanceInfo: z.string().optional().default(""),
  amount: z.number().positive("amount must be a positive number"),
  currency: z.string().optional().default("INR"),
  transactionDate: z.string().optional(), // ISO date string, optional
});

/**
 * Generic middleware factory: validates req.body against the given zod
 * schema, attaches the parsed/defaulted result back onto req.body, and
 * returns a 400 with details if validation fails — instead of letting
 * a malformed request reach Gemini or MongoDB.
 */
export function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: result.error.issues.map((i) => ({
          field: i.path.join("."),
          message: i.message,
        })),
      });
    }
    req.body = result.data;
    next();
  };
}
