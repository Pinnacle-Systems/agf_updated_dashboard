import { Router } from 'express';

import { get, getActualVsBudget, getActualVsBudgetValueMonthWise, getBuyerWiseRevenue, getESIPF,executeProcedure, getOrdersInHand,getEmployeesDetail,
    getSalarydet,  getOrdersInHandMonthWise, getShortShipmentRatio, getYearlyComp, 
    getpfdet,getesidet,getattdet,getagedet,getexpdet,getbgdet,getEmployeesDetail1,getPfDataDet,getEsiDataDet,
    getESIPF1,getattdetTable,
    getretdetTable,getLeaveAvailable} from '../services/misDashboard.service.js';

const router = Router();

router.get('/', get);

router.get('/ordersInHand', getOrdersInHand);

router.get('/employeeDet',getEmployeesDetail);

router.get('/employeeDetail',getEmployeesDetail1);


router.get ('/salaryDet',getSalarydet)

router.get ('/pfDet', getpfdet )

router.get ('/esiDet', getesidet )

router.get ('/AttDet', getattdet )
router.get ('/AttDetTable', getattdetTable )

router.get ('/RetDetTable', getretdetTable)


router.get ('/AgeDet', getagedet )

router.get ('/ExpDet', getexpdet )

router.get ('/BgDet', getbgdet )

router.get ('/PfDataDet', getPfDataDet)

router.get ('/EsiDataDet', getEsiDataDet)

router.get ('/leaveAvailable',getLeaveAvailable)


router.get('/ordersInHandMonthWise', getOrdersInHandMonthWise);

router.get('/actualVsBudgetValueMonthWise', getActualVsBudgetValueMonthWise);

router.get('/yearlyComp', getYearlyComp)

router.get('/buyerWiseRev', getBuyerWiseRevenue)

router.get('/actualVsBudget', getActualVsBudget)

router.get('/shortShipment', getShortShipmentRatio)

router.get('/getESIPF', getESIPF)

router.get('/getESIPF1', getESIPF1)

router.put('/execute-procedure', executeProcedure)

export default router;