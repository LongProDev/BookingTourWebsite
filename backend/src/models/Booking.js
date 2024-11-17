import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, required: true },
  tourName: { type: String, required: true },
  tourDate: { type: Date, required: true },
  tourTime: { type: String, required: true },
  tourStatus: {
    type: String,
    enum: ["Paid", "Completed", "Canceled"],
    default: "Paid",
  },
  bookingDate: { type: Date, required: true },
  discountCode: { type: String },
  vehicle: { type: String, required: true },
  totalPrice: { type: Number, required: true },
});

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
