import bcrypt from "bcrypt";
import { generateAuthTokenOwner } from "../middleware/auth.js";
import ownerModel from "../models/ownerSchema.js";
import car from "../models/car.js";
import location from "../models/location.js";
import bookings from "../models/bookings.js";
import messages from "../models/message.js";
import mongoose from "mongoose";
import moment from 'moment'

//owner registration

export const Register = async (req, res, next) => {
    try {
        let ownerDetails = req.body;
        const owner = await ownerModel.find({ email: ownerDetails.email });
        if (owner.length === 0) {
            ownerDetails.password = await bcrypt.hash(ownerDetails.password, 10);
            ownerModel.create({
                name: ownerDetails.name,
                email: ownerDetails.email.toLowerCase(),
                phone: ownerDetails.phone,
                password: ownerDetails.password,
            })
                .then((data) => {
                    console.log(data);
                })
                .catch((error) => {
                    console.log(error);
                });

            res.json({ status: true, result: ownerDetails });
        } else {
            return res.json({ error: true });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message)
    }
};

//owner login submit

export const LoginPost = async (req, res, next) => {
    try {
        let ownerSignUp = {
            Status: false,
            message: null,
            token: null,
            name: null,
        };
        const ownerDetails = req.body;
        const findowner = await ownerModel.findOne({ email: ownerDetails.email });
        if (findowner) {
            const isMatch = await bcrypt.compare(ownerDetails.password, findowner.password);
            if (isMatch === true) {
                const token = generateAuthTokenOwner(findowner);
                const name = findowner.name;
                ownerSignUp.message = "You are logged";
                ownerSignUp.Status = true;
                ownerSignUp.token = token;
                ownerSignUp.name = findowner.name;

                res.status(200)
                    .send({ ownerSignUp });
            } else {
                ownerSignUp.message = " Password is wrong";
                ownerSignUp.Status = false;
                res.send({ ownerSignUp });
            }
        } else {
            ownerSignUp.message = "your Email wrong";
            ownerSignUp.Status = false;
            res.send({ ownerSignUp });
        }
    } catch (error) {
        res.json({ status: "failed", message: error.message });
        console.log(error.message)
    }
};

//owner cars

export const Cars = async (req, res, next) => {
    try {
        const cars = await car.find({ owner: req.user._id })
        const owner = await ownerModel.findOne({ _id: req.user._id })
        const verification = owner.verified

        console.log(cars)
        res.json({
            data: cars,
            verification: verification
        });
    } catch (error) {
        res.json({ status: "failed", message: error.message });
        console.log(error.message)
    }
};

//owner add car page

export const addCar = async (req, res, next) => {
    try {
        const image = req.files.map((val) => val.filename)
        console.log(req.files);
        const { carModel, location, registrationNumber, perHourCharge, perDayCharge, perMonthCharge, place, seater, transmission, fuel } = req.body

        car.create({
            owner: req.user._id,
            carModel: carModel,
            location: location,
            registrationNumber: registrationNumber,
            perHourCharge: perHourCharge,
            perDayCharge: perDayCharge,
            perMonthCharge: perMonthCharge,
            place: place,
            seater: seater,
            transmission: transmission,
            fuel: fuel,
            images: image
        })
            .then((data) => {
                console.log(data);
                res.json({ status: "success" });
            })
            .catch((error) => {
                console.log(error);
                res.json({ status: "failed", message: error.message });
            });

    } catch (error) {
        console.log(error.message)
    }
};

export const Profile = async (req, res) => {

    console.log("reached profile")
    try {
        console.log(req.user.role, " : owner role")
        const owner = await ownerModel.findOne({ _id: req.user._id })
        console.log(owner, "owner details")

        res.status(200).json({
            owner: owner,

        });
    } catch (error) {
        console.log(error.message)
    }

}

export const UpdateProfile = async (req, res) => {
    try {
        const image = req.files.map((val) => val.filename)
        console.log(req.files);
        const { place, pincode, city, district, state, country, aadhar } = req.body
        console.log(req.body)
        console.log(req.body.place, "place here")

        ownerModel.updateOne({ _id: req.user._id }, {
            $set: {
                place: place,
                pincode: pincode,
                city: city,
                district: district,
                state: state,
                country: country,
                aadhar: aadhar,
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

export const Locations = async (req, res) => {
    try {
        const allLocations = await location.find({})
        const locations = [];
        allLocations.forEach(location => {
            locations.push(location.location);
        });
        console.log(locations, "locations array")
        res.status(200).json(locations)
    } catch (error) {
        console.log(error.message);
    }

}


export const Booking = async (req, res) => {
    try {
        console.log(req.user._id)
        const booking = await bookings.find({
        }).populate("car").sort({ createdAt: -1 })

        console.log(booking, "bookings")
        console.log(booking.length, "booking length")
        res.status(200).json(booking)
    }
    catch (error) {
        console.log(error, "error")
    }
}

export const changeStatus = async (req, res) => {
    try {
        console.log("entered to verification")

        const { id, status } = req.body
        console.log(status)
        const bookingStatus = await bookings.updateOne({ _id: id }, { $set: { status: status } })
        res.status(200).json(true)
    } catch (error) {
        console.log(error.message);
    }
}


export const message = async (req, res) => {
    console.log(req.body, "body here")
    typeof (req.body.userId, "boolena")
    try {
        let exist = await messages.findOne({
            user: req.body.userId,
            owner: req.user._id,
        });

        console.log(exist, "exist")
        if (exist) {
            exist.messages.push({
                message: req.body.message,
                recipient: req.body.userId,
                sender: req.user._id,
                author: req.body.author,
                time: req.body.time,
                date: req.body.date
            });
            await exist.save();
            res.status(200).json(exist)
        } else {
            const newMessage = await messages.create({
                user: req.body.userId,
                owner: req.user._id,
                messages: [{
                    message: req.body.message,
                    recipient: req.body.userId,
                    sender: req.user._id,
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
        console.log(req.query, "owner id in get message")
        if (req.query.ownerId) {
            const message = await messages.findOne({
                owner: req.user._id,
                user: req.query.ownerId
            })
            res.status(200).json(message)
        }

        else {
            const message = await messages.find({ owner: req.user._id }).populate('user')
            console.log(message);
            res.status(200).json(message);
        }

    } catch (error) {
        console.log(error.message, "error in get mesage")
    }
}

//total booking count of owner

export const totalBookings = async (req, res) => {
    console.log("entr")
    const ownerId = req.user._id; 

    const booking = await car.find({ owner: ownerId }); 

    const bookingIds = booking.map((booking) => booking._id);

    const matchingBookings = await bookings.find({ car: { $in: bookingIds } }); 

    const bookingAmount = await bookings.aggregate([
        { $match: { car: { $in: (await car.find({ owner: ownerId })).map(c => c._id) } } },
        { $group: { _id: null, TotalAmount: { $sum: "$TotalAmount" } } }
    ]);

    const upcoming = await bookings.find({ car: { $in: bookingIds }, status: { $ne: "Completed" } }).count();
    const completed = await bookings.find({ car: { $in: bookingIds }, status: "Completed"  }).count();


    console.log(bookingAmount, "booking amount in aggre")
    const TotalBookingAmount = bookingAmount.length > 0 ? bookingAmount[0].TotalAmount : 0;

    console.log(matchingBookings, " matched"); 
    console.log(TotalBookingAmount)
    res.status(200).json({
        totalBookings: { title: "Total Bookings", totalNumber: matchingBookings.length, icon: "ri-police-car-line", } ,
        TotalBookingAmount: { title: "Total Booking Amount", totalNumber: TotalBookingAmount, icon: "ri-police-car-line", } ,
        upcoming: { title: "Upcoming", totalNumber: upcoming, icon: "ri-police-car-line", },
        completed: { title: "Completed", totalNumber: completed, icon: "ri-police-car-line", },
    }
    )

}
export const monthlyWiseBookings = async (req, res) => {
    try {
      const year = moment().year(); // get the current year
      const months = moment.months(); // get the list of month names
      const monthTotals = await bookings.aggregate([
        {
          $lookup: {
            from: 'cars',
            localField: 'car',
            foreignField: '_id',
            as: 'car'
          }
        },
        {
          $match: {
            'car.owner': new mongoose.Types.ObjectId(req.user._id)
          }
        },
        {
          $group: {
            _id: { $month: '$createdAt' },
            totalAmount: { $sum: '$TotalAmount' }
          }
        },
        {
          $project: {
            _id: 0,
            month: '$_id',
            totalAmount: 1
          }
        }
      ]);
  
      const monthTotalsMap = new Map(monthTotals.map(({ month, totalAmount }) => [month, totalAmount]));
  
      const monthlyStats = months.map((monthName, i) => {
        const monthNum = i + 1;
        const totalAmount = monthTotalsMap.get(monthNum) || 0;
        return {
          month: monthName,
          bookings: totalAmount
        };
      });
  
      res.json(JSON.stringify(monthlyStats) );
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  };
  


  export const dailyWiseBookings = async (req, res) => {

    try {
        const weekDays = moment.weekdaysShort(); // get the list of day names
        const startOfWeek = moment().startOf('week'); // get the start of the current week
        const endOfWeek = moment().endOf('week'); // get the end of the current week
      
        const monthTotals = await bookings.aggregate([
          {
            $lookup: {
              from: 'cars',
              localField: 'car',
              foreignField: '_id',
              as: 'car'
            }
          },
          {
            $match: {
              'car.owner': new mongoose.Types.ObjectId(req.user._id),
              createdAt: {
                $gte: startOfWeek.toDate(),
                $lte: endOfWeek.toDate()
              }
            }
          },
          {
            $group: {
              _id: { $dayOfWeek: '$createdAt' },
              totalAmount: { $sum: '$TotalAmount' }
            }
          },
          {
            $project: {
              _id: 0,
              dayOfWeek: '$_id',
              totalAmount: 1
            }
          }
        ]);
      
        const dayTotalsMap = new Map(monthTotals.map(({ dayOfWeek, totalAmount }) => [dayOfWeek, totalAmount]));
      
        const weeklyStats = weekDays.map((dayName, i) => {
          const dayNum = i + 1;
          const totalAmount = dayTotalsMap.get(dayNum) || 0;
          return {
            day: dayName,
            bookings: totalAmount
          };
        });
      
        res.json(JSON.stringify(weeklyStats));
      } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
      }
      
      
  };
  