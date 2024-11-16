const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  time: { type: String, required: true },
  maxPeople: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  startLocation: { type: String, required: true },
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
