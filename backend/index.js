import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { dirname } from 'path';

import tourRoute from "./src/routes/TourRouters.js";
import userRoute from "./src/routes/UserRouters.js";
import authRoute from "./src/routes/AuthRouters.js";
import bookingRoute from "./src/routes/BookingRouters.js";
import statisticsRoute from "./src/routes/StatisticsRouters.js";
import paymentRoute from "./src/routes/PaymentRouters.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

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

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//middleware
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use("/api/tours", tourRoute);
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/bookings", bookingRoute);
app.use('/api/statistics', statisticsRoute);
app.use('/api/payments', paymentRoute);

const uploadDir = path.join(process.cwd(), 'public', 'images');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/images', express.static(uploadDir));

app.listen(port, () => {
  connect();
  console.log("server listening on port", port);
});
