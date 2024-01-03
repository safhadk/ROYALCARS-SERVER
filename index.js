import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";

dotenv.config();

const app = express();

// Enable CORS for all routes
// app.use(cors());

// Allow specific origins
app.use(cors({
  origin: ['https://gallery-pass-frontend-bv52.vercel.app', 'http://localhost:2000'],
  credentials: true,
  optionSuccessStatus: 200,
}));

app.use(express.json({ limit: "30mb", extended: true }));
app.use(morgan("dev"));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(express.static("public"));

// ... (your routes and other middleware)

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 5000; // Set a default port if not provided
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  })
  .catch((error) => console.log(`${error} did not connect`));
