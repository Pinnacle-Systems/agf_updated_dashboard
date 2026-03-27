import { Router } from "express";

import { getPurchase,getCompany ,getPurchaseOrder,getPurchaseOrderMonthWise,getPurchaseOrderYear,getPurchaseOrderMaterial} from "../services/purchase.service.js";

const router = Router();
router.get("/getPurchase", getPurchase);
router.get("/getCompany", getCompany);
router.get("/getPurchaseOrder", getPurchaseOrder);
router.get("/getMonthPurchaseOrder", getPurchaseOrderMonthWise);
router.get("/getYearPurchaseOrder", getPurchaseOrderYear);
router.get("/getMaterialWise", getPurchaseOrderMaterial);

export default router;
