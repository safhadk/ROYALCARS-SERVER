import adminModel from "../models/adminSchema.js";
import owner from "../models/ownerSchema.js";
import user from "../models/userSchema.js";
import { adminToken,} from "../middleware/auth.js";
import locations from "../models/location.js";
import userModel from "../models/userSchema.js";
import bookings from "../models/bookings.js";

//admin login submit

export const adminLogin = async (req, res, next) => {
    try {
        let adminResult = {
            Status: false,
            message: null,
            token: null,
        };
        let adminDetails = req.body;
        const admin = await adminModel.findOne({ email: adminDetails.email });
        if (admin) {
            if (admin.password === adminDetails.password) {
                const token = adminToken(admin);
                adminResult.Status = true;
                adminResult.token = token;
                res.json({ adminResult });
            } else {
                adminResult.message = "Your Password not matched";
                res.json({ adminResult });
            }
        } else {
            adminResult.message = "Your email is wrong";
            res.json({ adminResult });
        }
    } catch (error) {
        console.log(error.message);
    }
};

export const users=async(req,res)=>{
    try {
        console.log(req.user.role," : admin role")
    const users=await user.find({})
    res.status(200).json(users)
    } catch (err) {
        console.log(err.message);
    }
}

export const owners=async(req,res)=>{
    try {
    const owners=await owner.find({})
    res.status(200).json(owners)
    } catch (err) {
        console.log(err.message);
    }
}

export const block=async(req,res)=>{
    try {
        const {id}=req.body
        const userBlock=await user.updateOne({_id:id},{$set:{block:true}})
        res.status(200).json(true)
    } catch (err) {
        console.log(err.message);
    }
}

export const unblock=async(req,res)=>{
    try {
        console.log("user unblock here")
        const {id}=req.body
        const userunBlock=await user.updateOne({_id:id},{$set:{block:false}})
        res.status(200).json(false)
    } catch (err) {
        console.log(err.message);
    }
}


export const ownerBlock=async(req,res)=>{
    try {
        const {id}=req.body
        const ownerBlock=await owner.updateOne({_id:id},{$set:{block:true}})
        res.status(200).json(true)
    } catch (err) {
        console.log(err.message);
    }
}

export const ownerUnblock=async(req,res)=>{
    try {
        const {id}=req.body
        const ownerUnblock=await owner.updateOne({_id:id},{$set:{block:false}})
        res.status(200).json(false)
    } catch (err) {
        console.log(err.message);
    }
}

export const addLocation = async (req, res, next) => {
    try {
        console.log(req.files,"files");
        console.log(req.body,"body");
        const image = req.files.map((val) => val.filename)
        console.log(req.files);
        const { location } = req.body

        await locations.create({
            location: location,
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

export const location = async(req,res)=>{
    try {
        console.log("entered in location  controller")
        const location= await locations.find({})
        console.log(location,"location")
        res.status(200).json(location)
        } catch (err) {
            console.log(err.message);
        }
}

export const ownerDetails =async(req,res)=>{
try {
    const {id}=req.query
    const owners=await owner.find({_id:id})
    console.log(owners,"owner")
    res.status(200).json(owners)
 
} catch (err) {
    console.log(err.message)
}
}

export const ownerVerify=async(req,res)=>{
    try {
        console.log("entered to verification")
        const {id}=req.body
        const ownerverify=await owner.updateOne({_id:id},{$set:{verified:true}})
        res.status(200).json(true)
    } catch (error) {
        console.log(error.message);
    }
   
}

export const userDetails =async(req,res)=>{
    try {
        const {id}=req.query
        const users=await userModel.find({_id:id})
        console.log(users,"users")
        res.status(200).json(users)
     
    } catch (err) {
        console.log(err.message)
    }
    }

    export const userVerify=async(req,res)=>{
        try {
            console.log("entered to verification")
            const {id}=req.body
            const userverify=await userModel.updateOne({_id:id},{$set:{verified:true}})
            res.status(200).json(true)
        } catch (error) {
            console.log(error.message);
        }
    }

    export const Booking = async (req, res) => {
        try {
            const booking = await bookings.find({
            }).populate("car").sort({ createdAt: -1 })
            res.status(200).json(booking)
        }
        catch (error) {
            console.log(error, "error")
        }
    }