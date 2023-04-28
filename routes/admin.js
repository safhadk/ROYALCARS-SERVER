import express from "express";
const router = express.Router();
import { verifyTokenAdmin } from "../middleware/auth.js";
import upload from "../config/multer.js";
import { adminLogin,users,owners,block,unblock,ownerBlock,ownerUnblock,addLocation,location,ownerDetails,ownerVerify,userDetails,userVerify,Booking} from "../controller/adminController.js";

router.post("/adminLogin", adminLogin);
router.get('/users',verifyTokenAdmin,users);
router.get('/owners',verifyTokenAdmin,owners)
router.patch('/block',verifyTokenAdmin,block)
router.patch('/unblock',verifyTokenAdmin,unblock)
router.patch('/ownerBlock',verifyTokenAdmin,ownerBlock)
router.patch('/ownerunblock',verifyTokenAdmin,ownerUnblock)
router.post('/location',verifyTokenAdmin,upload.array('image', 1),addLocation)
router.get('/locations',verifyTokenAdmin,location)
router.get('/ownerDetails',verifyTokenAdmin,ownerDetails)
router.patch('/verify',verifyTokenAdmin,ownerVerify)
router.get('/userDetails',verifyTokenAdmin,userDetails)
router.patch('/userverify',verifyTokenAdmin,userVerify)
router.get('/bookings',verifyTokenAdmin,Booking)



export default router;
