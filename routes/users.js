import express from "express";
import upload from "../config/multer.js";
import {LoginPost, Register,Cars,Search,CreateOrder,VerifyPayment,Bookings,bookingDetails,Profile,UpdateProfile,checkverify,message,getmessage,OTP,location} from "../controller/usersController.js";
import { verifyToken } from "../middleware/auth.js";
const router = express.Router();

router.post("/register", Register);
router.post("/login", LoginPost);
router.get("/cars", Cars);
router.post('/search',Search)
router.post('/createOrder',verifyToken,CreateOrder)
router.post('/verifyPayment',verifyToken,VerifyPayment)
router.get('/bookings',verifyToken,Bookings)
router.get('/bookingDetails',verifyToken,bookingDetails)
router.get('/profile',verifyToken,Profile)
router.post('/profile',verifyToken,upload.array('image', 2),UpdateProfile)
router.get('/checkverify',verifyToken,checkverify)
router.post('/message',verifyToken,message)
router.get('/message',verifyToken,getmessage)
router.post('/otp',OTP)
router.get('/locations',location)

export default router;
