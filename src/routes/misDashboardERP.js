import { Router } from 'express';

import {
     get, getActualVsBudget, getActualVsBudgetValueMonthWise, getBuyerWiseRevenue, getOrdersInHand, getOrdersInHandMonthWise,
     getShortShipmentRatio, getYearlyComp, executeProcedure, turnOverCustomerWise, turnOverCountryWise, turnOverStyleItemWise, turnOverMonthWise, turnOverQuarterWise, turnOverYearWise,turnOverSingleMonthWise
} from '../services/misDashboard.serviceERP.js';

const router = Router();
router.get('/', get);
router.get('/customerWise', turnOverCustomerWise)
router.get('/countryWise', turnOverCountryWise)
router.get('/StyleItemWise', turnOverStyleItemWise)
router.get('/MonthWise', turnOverMonthWise)
router.get('/QuarterWise', turnOverQuarterWise)
router.get('/YearWise', turnOverYearWise)
router.get('/SingleMonthWise', turnOverSingleMonthWise)




router.get('/ordersInHand', getOrdersInHand);

router.get('/ordersInHandMonthWise', getOrdersInHandMonthWise);

router.get('/actualVsBudgetValueMonthWise', getActualVsBudgetValueMonthWise);

router.get('/yearlyComp', getYearlyComp)

router.get('/buyerWiseRev', getBuyerWiseRevenue)
router.put('/execute-procedure', executeProcedure)

router.get('/actualVsBudget', getActualVsBudget)

router.get('/shortShipment', getShortShipmentRatio)

export default router;