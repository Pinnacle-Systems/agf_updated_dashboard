import { Router } from "express";
import {
  getFabric,
  getFabricInward,
  getFabricInwardCustomer,
} from "../services/freeLookFabric.service.js";

const router = Router();

router.get("/", getFabric);
router.get("/getFabricInward", getFabricInward);
router.get("/fabricInwardCustomer", getFabricInwardCustomer);

export default router;
