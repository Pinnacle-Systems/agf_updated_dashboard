import { Router } from 'express';

import { get, getActualVsBudget, getActualVsBudgetValueMonthWise, getBuyerWiseRevenue,getOrdersInHand, getOrdersInHandMonthWise,
     getShortShipmentRatio, getYearlyComp,executeProcedure } from '../services/misDashboard.serviceERP.js';

const router = Router();
router.get('/', get);

router.get('/ordersInHand', getOrdersInHand);

router.get('/ordersInHandMonthWise', getOrdersInHandMonthWise);

router.get('/actualVsBudgetValueMonthWise', getActualVsBudgetValueMonthWise);

router.get('/yearlyComp', getYearlyComp)

router.get('/buyerWiseRev', getBuyerWiseRevenue)
router.put('/execute-procedure', executeProcedure)

router.get('/actualVsBudget', getActualVsBudget)

router.get('/shortShipment', getShortShipmentRatio)

export default router;