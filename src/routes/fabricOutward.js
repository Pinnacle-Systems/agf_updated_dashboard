import { Router } from "express";
import {
  getFabOutCust,
  getFabricOutward,
  getFabricOutwardByQuarter,
  getFabricOutwardByQuarterName,
  getFabricOutwardCustomer,
  getFabricOutwardCustomerByName,
} from "../services/freeLookFabricOutward.js";

const router = Router();

router.get("/fabOutCust", getFabOutCust);

router.get("/getFabricOutward", getFabricOutward);
router.get("/fabricOutwardCustomer", getFabricOutwardCustomer);
router.get("/fabOutByCusName", getFabricOutwardCustomerByName);

router.get("/fabOutwardByQuarter", getFabricOutwardByQuarter);
router.get("/fabOutwardByQuarterName", getFabricOutwardByQuarterName);

export default router;
