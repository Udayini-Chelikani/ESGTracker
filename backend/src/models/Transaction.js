import mongoose from "mongoose";

const aiAnalysisSchema = new mongoose.Schema(
  {
    sector: { type: String, default: "unknown" },
    primaryCategory: {
      type: String,
      enum: ["E", "S", "G", "neutral"],
      default: "neutral",
    },
    environmentalImpact: { type: Number, min: -1, max: 1, default: 0 },
    socialImpact: { type: Number, min: -1, max: 1, default: 0 },
    governanceImpact: { type: Number, min: -1, max: 1, default: 0 },
    confidence: { type: Number, min: 0, max: 1, default: 0 },
    reasoning: { type: String, default: "" },
    highRiskFlag: { type: Boolean, default: false },
  },
  { _id: false }
);

const transactionSchema = new mongoose.Schema(
  {
    clientName: { type: String, required: true, trim: true, index: true },
    beneficiaryName: { type: String, required: true, trim: true },
    remittanceInfo: { type: String, default: "" },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "INR" },
    transactionDate: { type: Date, default: Date.now },

    aiAnalysis: { type: aiAnalysisSchema, default: () => ({}) },

    weightedScore: { type: Number, default: 0 },

    isAnomaly: { type: Boolean, default: false },
    anomalyReason: { type: String, default: "" },

    // true if Gemini call failed or returned unparsable data —
    // lets the dashboard surface "needs review" items instead of silently
    // treating them as neutral/zero.
    needsReview: { type: Boolean, default: false },
  },
  { timestamps: true }
);

transactionSchema.index({ clientName: 1, createdAt: -1 });

export default mongoose.model("Transaction", transactionSchema);
