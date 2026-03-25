import { Router } from "express";

import { getPurchase,getCompany } from "../services/purchase.service.js";

const router = Router();
router.get("/getPurchase", getPurchase);
router.get("/getCompany", getCompany);

export default router;
