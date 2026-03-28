import { Router } from "express";

import {getCombinedPurchase, getPurchase,getCompany ,getPurchaseOrder,getPurchaseOrderMonthWise,getPurchaseOrderYear,getPurchaseOrderMaterial,getTopTenSupplier,getPurchaseGeneralYear,getPurchaseCombinedCOMPYear} from "../services/purchase.service.js";

const router = Router();

router.get("/getCompany", getCompany);

// router.get("/getPurchase", getPurchase);
// router.get("/getPurchaseOrder", getPurchaseOrder);

// front page 
router.get("/getCombinedPurchaseOrder", getCombinedPurchase);

router.get("/getYearPurchaseOrder", getPurchaseOrderYear);
router.get("/getYearPurchaseGeneral", getPurchaseGeneralYear);
router.get("/getYearPurchaseCombinedCOMP", getPurchaseCombinedCOMPYear);


router.get("/getMonthPurchaseOrder", getPurchaseOrderMonthWise);
router.get("/getMaterialWise", getPurchaseOrderMaterial);
router.get("/getTopTenSupplier", getTopTenSupplier);

export default router;
