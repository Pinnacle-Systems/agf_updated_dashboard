import { Router } from "express";
import { getFabricOutward } from "../services/freeLookFabricOutward.js";

const router = Router();

router.get("/getFabricOutward", getFabricOutward);

export default router;
