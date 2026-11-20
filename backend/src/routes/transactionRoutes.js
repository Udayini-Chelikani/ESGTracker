import { Router } from "express";
import {
  createTransaction,
  getTransactions,
  getTransactionById,
} from "../controllers/transactionController.js";
import { validateBody, transactionInputSchema } from "../middleware/validateRequest.js";

const router = Router();

router.post("/", validateBody(transactionInputSchema), createTransaction);
router.get("/", getTransactions);
router.get("/:id", getTransactionById);

export default router;
