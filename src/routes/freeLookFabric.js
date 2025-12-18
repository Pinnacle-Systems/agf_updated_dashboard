import { Router } from "express";
import {
  getFabric,
  getFabricInward,
  getFabricInwardCustomer,
  getFabricOutward,
  getFabricOutwardCustomer,
} from "../services/freeLookFabric.service.js";

const router = Router();

router.get("/", getFabric);
router.get("/getFabricInward", getFabricInward);
router.get("/fabricInwardCustomer", getFabricInwardCustomer);
router.get("/getFabricOutward", getFabricOutward);
router.get("/fabricOutwardCustomer", getFabricOutwardCustomer);
router.get("/fabricInwardByCusName", getFabricOutwardCustomer);

export default router;
