import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from 'url';

import tourRoute from "./src/routes/TourRouters.js";
import userRoute from "./src/routes/UserRouters.js";
import authRoute from "./src/routes/AuthRouters.js";
import bookingRoute from "./src/routes/BookingRouters.js";
import uploadRoute from './src/routes/uploadRoutes.js';


dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//database connection
const connect = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Database connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);  // Exit if database connection fails
  }
};

//middleware
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use("/api/tours", tourRoute);
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/bookings", bookingRoute);
app.use('/api/upload', uploadRoute);
app.use('/images', express.static('src/images'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(port, () => {
  connect();
  console.log("server listening on port", port);
});
