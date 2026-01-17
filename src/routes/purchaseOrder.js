import { Router } from "express";
import { getLoadPurchaseData, getRejectedPOS, getRejectedPOSBySupplier, getSupplierByName, getSupplierList, getSupplierPOS, getSupplierPOSMonth } from "../services/purchaseOrder.service.js";
const router = Router();

router.get("/purLoadData", getLoadPurchaseData);
router.get("/supplierPOs", getSupplierPOS);
router.get("/supplierPOSMonth", getSupplierPOSMonth);
router.get("/getSupplierDetails",getSupplierByName)
router.get("/getSuppliers", getSupplierList);
router.get("/rejectedPOs", getRejectedPOS);
router.get("/rejectedPOsBySupplier", getRejectedPOSBySupplier);

export default router;