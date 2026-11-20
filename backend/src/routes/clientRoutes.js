import { Router } from "express";
import {
  getAllClients,
  getClientByName,
  getClientTransactions,
} from "../controllers/clientController.js";

const router = Router();

router.get("/", getAllClients);
router.get("/:clientName", getClientByName);
router.get("/:clientName/transactions", getClientTransactions);

export default router;
