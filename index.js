import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";

dotenv.config();

const app = express();

// Enable CORS for all routes
const corsOptions = {
  origin: ['https://royalcars-server.vercel.app', 'http://localhost:2000'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', '*');
  res.status(200).send();
});






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
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit the application on database connection error
  });

