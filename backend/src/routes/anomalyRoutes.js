import { Router } from "express";
import { getAnomalies, getNeedsReview } from "../controllers/anomalyController.js";

const router = Router();

router.get("/", getAnomalies);
router.get("/needs-review", getNeedsReview);

export default router;
