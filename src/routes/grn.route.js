import { Router } from "express";
import {
  getGeneralGRNTable,
  getGeneralGRNDetails,
  getGreyFabricGRNTable,
  getGreyFabricGRNDetails,
  getGreyYarnGRNTable,
  getGreyYarnGRNDetails,
  getDyedYarnGRNTable,
  getDyedYarnGRNDetails,
  getDyedFabricGRNTable,
  getDyedFabricGRNDetails,
  getAccessoryGRNTable,
  getAccessoryGRNDetails,
  getCuttingPrintingGRNTable,
  getCuttingPrintingGRNDetails,
  getKnittingStoreGRNTable,
  getKnittingStoreGRNDetails,
  getEmbroideryAccessoryInwardTable,
  getEmbroideryAccessoryInwardDetails,
  getGRNSummaryData,
} from "../services/grn.service.js";

const router = Router();

router.get("/getGeneralGRNDetails", getGeneralGRNDetails);
router.get("/getGeneralGRNTable", getGeneralGRNTable);

router.get("/getGreyFabricGRNTable", getGreyFabricGRNTable);
router.get("/getGreyFabricGRNDetails", getGreyFabricGRNDetails);

router.get("/getGreyYarnGRNDetails", getGreyYarnGRNDetails);
router.get("/getGreyYarnGRNTable", getGreyYarnGRNTable);

router.get("/getDyedYarnGRNDetails", getDyedYarnGRNDetails);
router.get("/getDyedYarnGRNTable", getDyedYarnGRNTable);

router.get("/getDyedFabricGRNDetails", getDyedFabricGRNDetails);
router.get("/getDyedFabricGRNTable", getDyedFabricGRNTable);

router.get("/getAccessoryGRNDetails", getAccessoryGRNDetails);
router.get("/getAccessoryGRNTable", getAccessoryGRNTable);

router.get("/getCuttingPrintingGRNDetails", getCuttingPrintingGRNDetails);
router.get("/getCuttingPrintingGRNTable", getCuttingPrintingGRNTable);

router.get("/getKnittingStoreGRNTable", getKnittingStoreGRNTable);
router.get("/getKnittingStoreGRNDetails", getKnittingStoreGRNDetails);

router.get("/getEmbroideryAccessoryInwardTable", getEmbroideryAccessoryInwardTable);
router.get("/getEmbroideryAccessoryInwardDetails", getEmbroideryAccessoryInwardDetails);

router.get("/getGRNSummaryData", getGRNSummaryData);

export default router;

