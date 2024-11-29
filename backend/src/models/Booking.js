import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, required: true },
  numberOfAdults: { type: Number, required: true },
  numberOfChildren: { type: Number, default: 0 },
  notes: { type: String },
  paymentMethod: { 
    type: String, 
    enum: ['Stripe', 'MoMo'],
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
    enum: ["Pending", "Completed", "Canceled"],
    default: "Pending",
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Completed", "Canceled"],
    default: "Pending",
  },
  bookingDate: { type: Date, required: true },
  discountCode: { type: String },
  totalPrice: { type: Number, required: true },
  tourId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tour",
    required: true,
  },
},{ timestamps: true });

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
