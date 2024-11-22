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
  numberOfAdults: { type: Number, required: true },
  numberOfChildren: { type: Number, default: 0 },
  notes: { type: String },
  paymentMethod: { 
    type: String, 
    enum: ['PayPal', 'MoMo'],
    required: true 
  },
  agreedToPolicy: { type: Boolean, required: true },
  tourName: { type: String, required: true },
  scheduleId: { type: mongoose.Schema.Types.ObjectId, required: true },
  departureDate: { type: Date, required: true },
  departureTime: { type: String, required: true },
  returnDate: { type: Date, required: true },
  returnTime: { type: String, required: true },
  transportation: { type: String, required: true },
  tourStatus: {
    type: String,
    enum: ["Paid", "Completed", "Canceled"],
    default: "Paid",
  },
  bookingDate: { type: Date, required: true },
  discountCode: { type: String },
  totalPrice: { type: Number, required: true },
});

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
