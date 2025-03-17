import { Router } from 'express';

import { get, getActualVsBudget, getActualVsBudgetValueMonthWise, getBuyerWiseRevenue, getESIPF,executeProcedure, getOrdersInHand,getEmployeesDetail,
    getSalarydet,  getOrdersInHandMonthWise, getShortShipmentRatio, getYearlyComp, 
    getpfdet,getesidet,getattdet} from '../services/misDashboard.service.js';

const router = Router();

router.get('/', get);

router.get('/ordersInHand', getOrdersInHand);

router.get('/employeeDet',getEmployeesDetail);

router.get ('/salaryDet',getSalarydet)

router.get ('/pfDet', getpfdet )

router.get ('/esiDet', getesidet )

router.get ('/AttDet', getattdet )


router.get('/ordersInHandMonthWise', getOrdersInHandMonthWise);

router.get('/actualVsBudgetValueMonthWise', getActualVsBudgetValueMonthWise);

router.get('/yearlyComp', getYearlyComp)

router.get('/buyerWiseRev', getBuyerWiseRevenue)

router.get('/actualVsBudget', getActualVsBudget)

router.get('/shortShipment', getShortShipmentRatio)

router.get('/getESIPF', getESIPF)


router.put('/execute-procedure', executeProcedure)



export default router;