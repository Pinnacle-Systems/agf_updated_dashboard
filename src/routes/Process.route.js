import { Router } from "express";

const router = Router();

import {
  getProcessDetails,
  getProcessDetailsTable,

  getAccessoryProcessDetails,
  getAccessoryProcessDetailsTable,
  getYarnProcessData,
  getYarnProcessDetailsTable,

  getDyedFabricProcessData,
  getDyedFabricProcessDetailsTable,

  getWorkOrderBillRegisterData,
  getWorkOrderBillRegisterDetailsTable
} from "../services/process.service.js";

router.get("/getProcessDetails", getProcessDetails);
router.get("/getProcessDetailsTable", getProcessDetailsTable);

router.get("/getAccessoryProcessData", getAccessoryProcessDetails);
router.get("/getAccessoryProcessDetailsTable", getAccessoryProcessDetailsTable);

router.get("/getYarnProcessData", getYarnProcessData);
router.get("/getYarnProcessDetailsTable", getYarnProcessDetailsTable);
router.get("/getDyedFabricProcessData", getDyedFabricProcessData);
router.get("/getDyedFabricProcessDetailsTable", getDyedFabricProcessDetailsTable);


router.get("/getWorkOrderBillRegisterData", getWorkOrderBillRegisterData);
router.get("/getWorkOrderBillTableData", getWorkOrderBillRegisterDetailsTable);

export default router;
