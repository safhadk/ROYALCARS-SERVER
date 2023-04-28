import mongoose from "mongoose";
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
      },
      owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'owners',
        required: true
      },
      messages: [{
        sender: {
          type: mongoose.Schema.Types.ObjectId,
        //   required: true
        },
        recipient: {
          type: mongoose.Schema.Types.ObjectId,
        //   required: true
        },
        message: {
          type: String,
        //   required: true
        },
        sentAt: {
          type: Date,
          default: Date.now
        },
        author:{
          type:String
        },
        time:{
            type:String
        },
        date:{
          type:String
        }
      }]
    },{
        timestamps: true,
    });

const message = mongoose.model("message", messageSchema);
export default message;