import express from "express";
import bookingController from "../controllers/BookingController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", bookingController.getAllBookings);
router.get("/:id", bookingController.getBookingById);
router.get("/customer/:customerId", bookingController.getBookingsByCustomer);
router.post("/", bookingController.createBooking);
router.put("/:id", bookingController.updateBooking);
router.delete("/:id", bookingController.deleteBooking);

export default router;