import { Router } from "express";
import { AiControllers } from "./ai.controller";

const router = Router();

router.post("/plan-trip", AiControllers.generateTripPlan);

export const AiRoutes = router;
