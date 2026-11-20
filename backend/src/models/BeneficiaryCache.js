import mongoose from "mongoose";

// Caches Gemini's classification per beneficiary name so that if the same
// beneficiary appears in many transactions, we don't burn API calls (or
// hit rate limits) re-classifying it every time. Remittance info still
// varies per transaction, so this is a starting point / fallback rather
// than a full substitute for classification — see geminiService.js.
const beneficiaryCacheSchema = new mongoose.Schema(
  {
    beneficiaryName: { type: String, required: true, unique: true, trim: true },
    sector: { type: String, default: "unknown" },
    primaryCategory: {
      type: String,
      enum: ["E", "S", "G", "neutral"],
      default: "neutral",
    },
    environmentalImpact: { type: Number, default: 0 },
    socialImpact: { type: Number, default: 0 },
    governanceImpact: { type: Number, default: 0 },
    hitCount: { type: Number, default: 1 },
  },
  { timestamps: true }
);

export default mongoose.model("BeneficiaryCache", beneficiaryCacheSchema);
