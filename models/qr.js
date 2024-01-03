import mongoose from "mongoose";

const qrCodeSchema = new mongoose.Schema({
    text: {
      type: String,
      required: true,
      unique: true,
    },
    scannedAt: {
      type: Date,
      default: Date.now,
    },
  });
  
  const qr = mongoose.model('QRCode', qrCodeSchema);
   export default qr;