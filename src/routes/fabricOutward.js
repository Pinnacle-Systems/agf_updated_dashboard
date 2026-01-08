import { Router } from "express";
import {
  getFabOutCust,
  getFabricOutward,
  getFabricOutwardByMonth,
  getFabricOutwardByMonthDate,
  getFabricOutwardByQuarter,
  getFabricOutwardByQuarterName,
  getFabricOutwardCusByMonth,
  getFabricOutwardCustomer,
  getFabricOutwardCustomerByName,
  getFabricOutwardQuarterCompare,
  getFabricOutwardYearCompare,
} from "../services/freeLookFabricOutward.js";

const router = Router();

router.get("/fabOutCust", getFabOutCust);

router.get("/getFabricOutward", getFabricOutward);
router.get("/fabricOutwardCustomer", getFabricOutwardCustomer);
router.get("/fabOutByCusName", getFabricOutwardCustomerByName);

router.get("/fabOutwardByQuarter", getFabricOutwardByQuarter);
router.get("/fabOutwardByQuarterName", getFabricOutwardByQuarterName);

router.get("/fabricOutwardByMonth", getFabricOutwardByMonth);
router.get("/fabricOutwardCusByMonth", getFabricOutwardCusByMonth);

router.get("/fabricOutwardByMonthDate", getFabricOutwardByMonthDate);

router.get("/fabricOutwardYearCompare",getFabricOutwardYearCompare)
router.get("/fabricOutwardQuarterCompare",getFabricOutwardQuarterCompare)

export default router;
