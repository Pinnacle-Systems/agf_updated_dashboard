import { Router } from "express";
import {
  getFabInwardStateDropdown,
  getFabricInward,
  getFabricInwardByMonth,
  getFabricInwardByMonthDate,
  getFabricInwardByQuarter,
  getFabricInwardByQuarterName,
  getFabricInwardCusByMonth,
  getFabricInwardCustomer,
  getFabricInwardCustomerByName,
  getFabricInwardState,
  getFabricInwardStateDetail,
  getFanInwardCust,
} from "../services/freeLookFabric.service.js";
import {
  getFabric,
  getFabricOutward,
  getFabricOutwardCustomer,
} from "../services/freeLookFabricOutward.js";

const router = Router();

router.get("/", getFabric);
router.get("/fabInwardCust", getFanInwardCust);

router.get("/getFabricInward", getFabricInward);
router.get("/fabricInwardCustomer", getFabricInwardCustomer);
router.get("/fabricInwardByCusName", getFabricInwardCustomerByName);

router.get("/fabricInwardByMonth", getFabricInwardByMonth);
router.get("/fabricInwardCusByMonth", getFabricInwardCusByMonth);

router.get("/fabricInwardByQuarter", getFabricInwardByQuarter);
router.get("/fabricInwardByQuarterName", getFabricInwardByQuarterName);

router.get("/fabricInwardByMonthDate", getFabricInwardByMonthDate);

router.get("/fabricInwardState", getFabricInwardState);
router.get("/fabricInwardStateDetail", getFabricInwardStateDetail);
router.get("/fabricInwardStateDropdown", getFabInwardStateDropdown);

router.get("/getFabricOutward", getFabricOutward);
router.get("/fabricOutwardCustomer", getFabricOutwardCustomer);

export default router;
