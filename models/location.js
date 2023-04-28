import mongoose from "mongoose";
const Schema = mongoose.Schema;

const locationSchema = new Schema({
  
    location:{
    type:String
    },
    images: {
        type: Array,
    }
},{
    timestamps: true,
});

const location = mongoose.model("location", locationSchema);
export default location;