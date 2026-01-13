import { Router } from "express";
import { getLoadPurchaseData, getSupplierPOS, getSupplierPOSMonth } from "../services/purchaseOrder.service.js";
const router = Router();

router.get("/purLoadData", getLoadPurchaseData);
router.get("/supplierPOs", getSupplierPOS);
router.get("/supplierPOSMonth", getSupplierPOSMonth);


export default router;