import { Router } from 'express';
const router = Router();
import { login, create, get, remove, getOne, getUserDetails, get_Usedetails, UpdateUserOnPage, Add_Company } from "../services/user.service.js";

router.post('/login', login);

router.post('/', create);
router.get('/getUserBasicDetails',getUserDetails)

router.get('/', get);

router.get('/userDetails', getOne)

router.delete('/', remove)

router.get('/getuserdetail', get_Usedetails)

router.post('/updateUserOnPage', UpdateUserOnPage)

router.post('/addcompany', Add_Company)






// router.put('/', put)

export default router;