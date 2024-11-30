import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
  departureDate: { type: Date, required: true },
  departureTime: { type: String, required: true },
  returnDate: { type: Date, required: true },
  returnTime: { type: String, required: true },
  transportation: { type: String, required: true },
  availableSeats: { type: Number, required: true, min: 0 },
});

const tourSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: [{ type: String, required: true }],
  time: { type: String, required: true },
  location: { type: String, required: true },
  startLocation: { type: String, required: true },
  featured: { type: Boolean, default: false },
  schedules: [scheduleSchema],
  ratingStats: {
    averageRating: { type: Number, default: 0 },
    numberOfReviews: { type: Number, default: 0 }
  }
}, { timestamps: true });

tourSchema.statics.updateRatingStats = async function(tourId) {
  const stats = await this.model('Review').aggregate([
    { $match: { tourId: new mongoose.Types.ObjectId(tourId) } },
    { 
      $group: {
        _id: '$tourId',
        averageRating: { $avg: '$rating' },
        numberOfReviews: { $sum: 1 }
      }
    }
  ]);

  await this.findByIdAndUpdate(tourId, {
    ratingStats: {
      averageRating: stats[0]?.averageRating || 0,
      numberOfReviews: stats[0]?.numberOfReviews || 0
    }
  });
};

const Tour = mongoose.model("Tour", tourSchema);

export default Tour;
