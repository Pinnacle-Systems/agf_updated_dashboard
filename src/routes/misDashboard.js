import { Router } from 'express';

import { get, getActualVsBudget, getActualVsBudgetValueMonthWise, getBuyerWiseRevenue, getESIPF,executeProcedure, getOrdersInHand,getEmployeesDetail,
    getSalarydet,  getOrdersInHandMonthWise, getShortShipmentRatio, getYearlyComp, 
    getpfdet,getesidet,getattdet,getagedet,getexpdet,getbgdet,getEmployeesDetail1,getPfDataDet,getEsiDataDet} from '../services/misDashboard.service.js';

const router = Router();

router.get('/', get);

router.get('/ordersInHand', getOrdersInHand);

router.get('/employeeDet',getEmployeesDetail);

router.get('/employeeDetail',getEmployeesDetail1);


router.get ('/salaryDet',getSalarydet)

router.get ('/pfDet', getpfdet )

router.get ('/esiDet', getesidet )

router.get ('/AttDet', getattdet )

router.get ('/AgeDet', getagedet )

router.get ('/ExpDet', getexpdet )

router.get ('/BgDet', getbgdet )

router.get ('/PfDataDet', getPfDataDet)

router.get ('/EsiDataDet', getEsiDataDet)


router.get('/ordersInHandMonthWise', getOrdersInHandMonthWise);

router.get('/actualVsBudgetValueMonthWise', getActualVsBudgetValueMonthWise);

router.get('/yearlyComp', getYearlyComp)

router.get('/buyerWiseRev', getBuyerWiseRevenue)

router.get('/actualVsBudget', getActualVsBudget)

router.get('/shortShipment', getShortShipmentRatio)

router.get('/getESIPF', getESIPF)


router.put('/execute-procedure', executeProcedure)



export default router;