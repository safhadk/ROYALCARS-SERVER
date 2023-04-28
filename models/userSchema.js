import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
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
        licence:{
            type: String,
        },
        images: {
            type: Array,
        },
        isBanned: { type: Boolean, default: false },
        block: { type: Boolean, default: false },
        verified:{
            type:Boolean,
        },
    },
    {
        timestamps: true,
    }
);

const userModel = mongoose.model("users", userSchema);
export default userModel;
