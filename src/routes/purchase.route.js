import { Router } from "express";

import {getCombinedPurchase,getCombinedPurchaseOrderMonthWise,getGenaralPurchaseMonthWise, getPurchase,getCompany ,getPurchaseOrder,getPurchaseOrderMonthWise,getPurchaseOrderYear,getPurchaseOrderMaterial,getTopTenSupplierOrder,getPurchaseGeneralYear,getPurchaseCombinedCOMPYear,getTopTenSupplierCombined,getTopTenSupplierGeneral,getPurchaseOrderQuarterWise,getPurchaseGeneralQuarterWise,getCombinedPurchaseQuarterWise,getPurchaseGeneralItemGroup} from "../services/purchase.service.js";
import { getGeneralTable,getGreyYarnTable,getDyedYarnTable,getGreyFabricTable,getDyedFabricTable,getAccessoryTable,getGeneralSupplierToptenTable } from "../services/purchaseTable.service.js";

const router = Router();

router.get("/getCompany", getCompany);

// router.get("/getPurchase", getPurchase);
// router.get("/getPurchaseOrder", getPurchaseOrder);

// front page 
router.get("/getCombinedPurchaseOrder", getCombinedPurchase);

router.get("/getYearPurchaseOrder", getPurchaseOrderYear);
router.get("/getYearPurchaseGeneral", getPurchaseGeneralYear);
router.get("/getYearPurchaseCombinedCOMP", getPurchaseCombinedCOMPYear);




router.get("/getQuarterPurchaseOrder", getPurchaseOrderQuarterWise);
router.get("/getQuarterPurchaseGeneral", getPurchaseGeneralQuarterWise);
router.get("/getQuarterPurchaseCombinedCOMP", getCombinedPurchaseQuarterWise);


router.get("/getMonthPurchaseOrder", getPurchaseOrderMonthWise);
router.get("/getMonthGeneralPurchaseOrder", getGenaralPurchaseMonthWise);
router.get("/getMonthCombinedPurchaseOrder", getCombinedPurchaseOrderMonthWise);



router.get("/getTopTenSupplierOrder", getTopTenSupplierOrder);
router.get("/getTopTenSupplierGeneral", getTopTenSupplierGeneral);
router.get("/getTopTenSupplierCombined", getTopTenSupplierCombined);




router.get("/getMaterialWise", getPurchaseOrderMaterial);
router.get("/getItemGroupWise", getPurchaseGeneralItemGroup);




router.get("/getGeneralYear", getGeneralTable);

router.get("/getGreyYarnTable", getGreyYarnTable);
router.get("/getDyedYarnTable", getDyedYarnTable);
router.get("/getGreyFabricTable", getGreyFabricTable);
router.get("/getDyedFabricTable", getDyedFabricTable);
router.get("/getAccessoryTable", getAccessoryTable);


router.get('/getGeneralSupplierToptenTable',getGeneralSupplierToptenTable)


export default router;
