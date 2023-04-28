import mongoose from "mongoose";

const ownerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        phone: {
            type: Number,
            required: true,
        },
        password: {
            type: String,
            trim: true,
            required: true,
            minlength: [6],
        },
        place:{
            type: String,
        },
        pincode:{
            type: String,
        },
        city:{
            type: String,
        },
        district:{
            type: String,
        },
        state:{
            type: String,
        },
        country:{
            type: String,
        },
        aadhar:{
            type: String,
        },
        images: {
            type: Array,
        },
        isBanned: { 
            type: Boolean,
             default: false 
        },
        verified:{
            type:Boolean,
        },
        block:{
            type:Boolean,
            default:false
        }
    },
    {
        timestamps: true,
    }
);

const ownerModel = mongoose.model("owners", ownerSchema);
export default ownerModel;
