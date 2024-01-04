import bcrypt from "bcrypt";
import { generateAuthToken } from "../middleware/auth.js";
import userModel from "../models/userSchema.js";
import car from "../models/car.js";
import * as paypal from "../middleware/paypal-api.js";
import bookings from "../models/bookings.js";
import { Id } from '../helper/bookingId-Generator.js'
import messages from "../models/message.js";
import locations from "../models/location.js";
import twilio from 'twilio'
const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
// controllers/scannerController.js
import QRCode from '../models/qr.js';

//user Registration

export const Register = async (req, res, next) => {
    try {
        let userDetails = req.body;
        await client.verify.v2.services('VA1476f4aeb245a45a4be560a4eef6be8d')
            .verifications
            .create({ to: `+91${userDetails.phone}`, channel: 'sms' })
            .then(verification => {
                console.log('success')
                res.json({ status: true, name: userDetails.name, email: userDetails.email, phone: userDetails.phone, password: userDetails.password })
            })
            .catch(error => {
                console.error(error + error.message, "error in otp send")
            })

    } catch (error) {
        // res.status(500).json({ error: error.message });
        console.log(error.message)
    }
};

//user login submit

export const LoginPost = async (req, res, next) => {
    try {
        console.log(req.body, "body")
        const { email } = req.body
        console.log(email, "email in backend")
        console.log(req.body.login === "google")
        if (req.body.login === "google") {

            let userSignUp = {
                Status: false,
                message: null,
                token: null,
                name: null,
            }
            const findUser = await userModel.findOne({ email: email });
            console.log(findUser, "l")

            if (findUser) {

                const token = generateAuthToken(findUser);
                const name = findUser.name;
                userSignUp.message = "You are logged";
                userSignUp.Status = true;
                userSignUp.token = token;
                userSignUp.name = findUser.name;

                res.status(200)
                    .send({ userSignUp });

            } else {
                userSignUp.message = "your Email wrong";
                userSignUp.Status = false;
                res.send({ userSignUp });
            }
        }


        else {
            let userSignUp = {
                Status: false,
                message: null,
                token: null,
                name: null,
            };
            const userDetails = req.body;
            const findUser = await userModel.findOne({ email: userDetails.email });
            if (findUser) {
                const isMatch = await bcrypt.compare(userDetails.password, findUser.password);
                if (isMatch === true) {
                    const token = generateAuthToken(findUser);
                    const name = findUser.name;
                    userSignUp.message = "You are logged";
                    userSignUp.Status = true;
                    userSignUp.token = token;
                    userSignUp.name = findUser.name;

                    res.status(200)
                        .send({ userSignUp });
                } else {
                    userSignUp.message = " Password is wrong";
                    userSignUp.Status = false;
                    res.send({ userSignUp });
                }
            } else {
                userSignUp.message = "your Email wrong";
                userSignUp.Status = false;
                res.send({ userSignUp });
            }
        }

    } catch (error) {
        res.json({ status: "failed", message: error.message });
        console.log(error.message)
    }
};

//user cars page

export const Cars = async (req, res, next) => {
    try {
        let cars;

        if (req.query.id) {
            cars = await car.find({ _id: req.query.id })

            const pickupTime = new Date(req.query.pickup);
            const dropTime = new Date(req.query.drop);

            const timeDiff = dropTime - pickupTime;
            const oneDay = 24 * 60 * 60 * 1000;

            let diffInDays = Math.floor(timeDiff / oneDay);
            let diffInHours = Math.floor((timeDiff % oneDay) / (60 * 60 * 1000));
            let diffInMonths = 0;

            const result = `${diffInMonths} month ${diffInDays} day ${diffInHours} hour`;
            console.log(result);

            let totalrent;
            totalrent = diffInDays % 30 * parseInt(cars[0].perDayCharge) + Math.floor(diffInDays / 30) * parseInt(cars[0].perMonthCharge) + diffInHours * parseInt(cars[0].perHourCharge)
            console.log(totalrent)

            res.status(200)
                .json({
                    data: cars,
                    rentAmount: totalrent,
                });
        } else {
            cars = await car.find({})
            const AvailableCars = await car.updateMany(
                {},
                { $set: { status: "Available" } }
            );

            res.status(200).json({
                data: cars,
            });
        }
    } catch (error) {
        res.json({ status: "failed", message: error.message });
        console.log(error.message)
    }
};

//Search

export const Search = async (req, res) => {
    try {
        const pickupDate = req.body.pickup;
        const dropDate = req.body.drop;

        const reservations = await bookings.find({
            pickup: { $lte: new Date(dropDate) },
            drop: { $gte: new Date(pickupDate) }
        });

        const carIds = [];
        reservations.forEach(reservation => {
            carIds.push(reservation.car);
        });
        const bookedCars = await car.updateMany(
            { _id: { $in: carIds } },
            { $set: { status: "Booked" } }
        );

        const AvailableCars = await car.updateMany(
            { _id: { $nin: carIds } },
            { $set: { status: "Available" } }
        );

        const pickupTime = new Date(req.body.pickup);
        const dropTime = new Date(req.body.drop);

        const timeDiff = dropTime - pickupTime;
        const oneDay = 24 * 60 * 60 * 1000;

        let diffInDays = Math.floor(timeDiff / oneDay);
        let diffInHours = Math.floor((timeDiff % oneDay) / (60 * 60 * 1000));
        let diffInMonths = 0;

        const result = `search : ${diffInMonths} month ${diffInDays} day ${diffInHours} hour`;
        console.log(result);

        let cardata = {
            city: req.body.city,
            pickup: req.body.pickup,
            drop: req.body.drop,
            days: diffInDays,
            hours: diffInHours
        }

        const cars = await car.find({
            location: { $regex: new RegExp('^' + req.body.city + '$', 'i') }
        })
        res.status(200).json({ data: cars, bookingCarData: cardata })
    } catch (err) {
        console.log(err.message)
        res.status(500).send(err.message);
    }
}

//create order 

export const CreateOrder = async (req, res) => {
    try {

        const order = await paypal.createOrder(req.body);
        res.json(order);


    } catch (err) {
        console.log(err.message, "error occured in create order")
        res.status(500).send(err.message);
    }
}

//verify payment

export const VerifyPayment = async (req, res) => {
    try {
        const bookingId = Id();
        const { orderID } = req.body
        const { carId, advance, ownerAmount, TotalAmount, drop, pickup } = req.body.bookingData
        const captureData = await paypal.capturePayment(orderID)
        const booking = await bookings.create({
            user: req.user._id,
            bookingId,
            paymentId: orderID,
            car: carId,
            Advance: advance,
            ownerAmount,
            TotalAmount,
            drop,
            pickup,
            status: 'pickup pending'
        })
        const carStatus = await car.updateOne({ _id: carId }, { $set: { onRent: true } })
        res.json(captureData)
    } catch (err) {
        res.status(500).send(err.message);
        console.log(err.message)
    }
}

export const Bookings = async (req, res) => {
    try {
        const booking = await bookings.find({ user: req.user._id }).populate('car').sort({ pickup: -1 })
        res.status(200).json(booking)
        // console.log(booking)
        // console.log(booking.length)
    }
    catch (error) {
        console.log(error.messsage)
    }
}

export const bookingDetails = async (req, res) => {
    try {
        console.log("booking deatils hereee")
        const { id } = req.query
        console.log(id, "id")
        console.log(req.query)
        console.log(2)
        console.log(req.user._id, "user id")
        const booking = await bookings.findOne({ _id: id, user: req.user._id }).populate('car')
        console.log(booking, "booking")
        res.status(200).json(booking)

    } catch (error) {
        console.log(error.messsage, "error")
    }
}


export const Profile = async (req, res) => {
    console.log(req.user.role, " : user role")
    console.log("reached profile")
    try {
        const user = await userModel.findOne({ _id: req.user._id })
        console.log(user, "user details")

        res.status(200).json({
            user: user,
        });
    } catch (error) {
        console.log(error.message)
    }

}


export const UpdateProfile = async (req, res) => {
    try {
        console.log("update profile hree")
        const image = req.files.map((val) => val.filename)
        console.log(req.files);
        const { place, pincode, city, district, state, country, licence } = req.body
        console.log(req.body)
        console.log(req.body.place, "place here")

        userModel.updateOne({ _id: req.user._id }, {
            $set: {
                place: place,
                pincode: pincode,
                city: city,
                district: district,
                state: state,
                country: country,
                licence: licence,
                verified: false,
                images: image
            }
        })
            .then((data) => {
                console.log(data);
                res.status(200).json({ status: "success" });
            })
            .catch((error) => {
                console.log(error);
                res.json({ status: "failed", message: error.message });
            });

    } catch (error) {
        console.log(error.message)
    }
}

export const checkverify = async (req, res) => {
    try {
        console.log("entered to chec verify")
        console.log(req.user._id, "id hereee")
        const verification = await userModel.findOne({ _id: req.user._id })
        if (verification.verified !== true) {
            console.log("success")
            res.json(false)
        }
    } catch (error) {

    }
}

export const message = async (req, res) => {
    console.log(req.body, "body here")
    try {

        let exist = await messages.findOne({
            user: req.user._id,
            owner: req.body.ownerId,
        });

        console.log(exist, "exist")
        if (exist) {
            exist.messages.push({
                message: req.body.message,
                sender: req.user._id,
                recipient: req.body.ownerId,
                author: req.body.author,
                time: req.body.time,
                date: req.body.date
            });
            await exist.save();
            res.status(200).json(exist)
        } else {
            const newMessage = await messages.create({
                user: req.user._id,
                owner: req.body.ownerId,
                messages: [{
                    message: req.body.message,
                    sender: req.user._id,
                    recipient: req.body.ownerId,
                    author: req.body.author,
                    time: req.body.time,
                    date: req.body.date
                }]
            });
            res.status(200).json(newMessage)
        }


    } catch (error) {
        console.log(error.message, "in message")
    }
}

export const getmessage = async (req, res) => {
    console.log("entered to get message")
    try {
        const userId=req.user._id
        if (req.query.ownerId) {
            console.log(req.query, "owner id in get message")
            const message = await messages.findOne({
                user: req.user._id,
                owner: req.query.ownerId,
            })
            console.log(userId,"52")
            res.status(200).json(message)
        } else {
            console.log("user role")
            const message = await messages.find({ user: req.user._id }).populate('owner')
            res.status(200).json(message);
        }

    } catch (error) {
        console.log(error.message, "error in get mesage")
    }
}

export const OTP = async (req, res) => {
    try {
        let { OTP, email, phone, password, name } = req.body
        console.log(req.body, "in otp")
        client.verify.v2.services('VA1476f4aeb245a45a4be560a4eef6be8d')
            .verificationChecks
            .create({ to: `+91${phone}`, code: OTP })
            .then(async verification_check => {
                if (verification_check.status == "approved") {
                    console.log("aprovede")
                    const user = await userModel.find({ email: email });
                    if (user.length === 0) {
                        console.log(password, "before bcrypt")
                        password = await bcrypt.hash(password, 10);
                        userModel
                            .create({
                                name: name,
                                email: email.toLowerCase(),
                                phone: phone,
                                password: password,
                            })
                            .then((data) => {
                                console.log('user created')
                                console.log(data);
                                res.json({ status: true })
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                        // res.json({ status: true, result: userDetails });
                    } else {
                        return res.json({ error: true });
                    }

                } else if (verification_check.status == "pending") {
                    console.log('failed');
                    res.json({ status: false })
                } else {
                    console.log("failed 2");
                    res.json({ status: false })
                }
            })
    } catch (error) {
        console.error(`Error in verifyotp: ${error.message}`)
    }
}

export const location = async (req, res) => {
    try {
        const location = await locations.find({})
        console.log(location, "location")
        res.status(200).json(location)
    } catch (err) {
        console.log(err.message);
    }
}


export const scanner = async (req, res) => {
  try {
    console.log(qrCode.text, "qr data1");
    const { qrCode } = req.body;
    console.log(qrCode.text, "qr data");

    // Check if the QR code exists in the database
    const existingQRCode = await QRCode.findOne({ text: qrCode.text });

    if (existingQRCode) {
        console.log(existingQRCode)
      console.log("already");
      res.json({ message: 'QR code already scanned' });
    } else {
      console.log("new scanning");

      // Save the QR code to the database
      const newQRCode = new QRCode({ text: qrCode.text });
      await newQRCode.save();

      res.json({ message: 'QR code scanned successfully' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
