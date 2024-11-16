const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/BookingController");
const authMiddleware = require("../middlewares/authMiddleware");

router.use(authMiddleware);

router.get("/", bookingController.getAllBookings);
router.get("/:id", bookingController.getBookingById);
router.get("/customer/:customerId", bookingController.getBookingsByCustomer);
router.post("/", bookingController.createBooking);
router.put("/:id", bookingController.updateBooking);
router.delete("/:id", bookingController.deleteBooking);

module.exports = router;