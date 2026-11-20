import express from "express";
import cors from "cors";
import morgan from "morgan";

import transactionRoutes from "./routes/transactionRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import anomalyRoutes from "./routes/anomalyRoutes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === "development" ? "dev" : "combined"));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/transactions", transactionRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/anomalies", anomalyRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
