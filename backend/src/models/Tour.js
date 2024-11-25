import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
  departureDate: { type: Date, required: true },
  departureTime: { type: String, required: true },
  returnDate: { type: Date, required: true },
  returnTime: { type: String, required: true },
  transportation: { type: String, required: true },
  availableSeats: { type: Number, required: true, min: 0 },
  price: { type: Number, required: true, min: 0 }
});

const tourSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: [{ type: String, required: true }],
  time: { type: String, required: true },
  location: { type: String, required: true },
  maxPeople: { type: Number, required: true },
  startLocation: { type: String, required: true },
  featured: { type: Boolean, default: false },
  schedules: [scheduleSchema]
});

const Tour = mongoose.model("Tour", tourSchema);

export default Tour;
