import mongoose from "mongoose";
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'users',
        required:true
    },
    car:{
        type: Schema.Types.ObjectId,
        ref: 'car',
        required:true
    },
    bookingId: {
        type: String,
        required:true
    },
    Advance: {
        type: Number,
        required:true
    },
    ownerAmount: {
        type: Number,
        required:true
    },
    TotalAmount: {
        type: Number,

    },
    paymentId: {
        type: String,
        required:true
    },
    pickup:{
       type:Date,
       required:true
    },
    drop:{
        type:Date,
        required:true
    },
    orderDate:{
        type:Date,
        required:true,
        default:Date.now()
    },
    status:{
        type:String,
        required:true,
    }
},
{
    timestamps: true,
});

const booking = mongoose.model("bookings", bookingSchema);
export default booking;