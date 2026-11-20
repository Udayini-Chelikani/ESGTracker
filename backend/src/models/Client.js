import mongoose from "mongoose";

const scoreSnapshotSchema = new mongoose.Schema(
  {
    date: { type: Date, default: Date.now },
    E: Number,
    S: Number,
    G: Number,
    overall: Number,
  },
  { _id: false }
);

const clientSchema = new mongoose.Schema(
  {
    clientName: { type: String, required: true, unique: true, trim: true },

    runningScore: {
      E: { type: Number, default: 0 },
      S: { type: Number, default: 0 },
      G: { type: Number, default: 0 },
      overall: { type: Number, default: 0 },
    },

    transactionCount: { type: Number, default: 0 },

    // recent weighted scores, kept short — used by anomalyService
    // to compute a rolling mean/stddev without re-querying all transactions.
    recentScores: { type: [Number], default: [] },

    scoreHistory: { type: [scoreSnapshotSchema], default: [] },

    // sector -> total amount paid, used for anomaly "sector shift" checks
    sectorSpend: { type: Map, of: Number, default: {} },

    anomalyCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Client", clientSchema);
