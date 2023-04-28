import upload from "../config/multer.js";
import express from "express";
import {  LoginPost, Register,Cars,addCar,Profile,UpdateProfile,Locations,Booking,changeStatus,message,getmessage,totalBookings,monthlyWiseBookings,dailyWiseBookings} from "../controller/ownerController.js";
import { verifyTokenOwner } from "../middleware/auth.js";
const router = express.Router();

router.post("/register", Register);
router.post("/login", LoginPost);
router.get("/cars",verifyTokenOwner, Cars);
router.post('/addCar',verifyTokenOwner,upload.array('image', 4),addCar)
router.get('/profile',verifyTokenOwner,Profile)
router.post('/profile',verifyTokenOwner,upload.array('image', 2),UpdateProfile)
router.get('/locations',verifyTokenOwner,Locations)
router.get('/bookings',verifyTokenOwner,Booking)
router.patch('/changestatus',verifyTokenOwner,changeStatus)
router.post('/message',verifyTokenOwner,message)
router.get('/message',verifyTokenOwner,getmessage)
router.get('/totalBookings',verifyTokenOwner,totalBookings)
router.get('/monthlywisebookings',verifyTokenOwner,monthlyWiseBookings)
router.get('/dailywisebookings',verifyTokenOwner,dailyWiseBookings)

export default router;
