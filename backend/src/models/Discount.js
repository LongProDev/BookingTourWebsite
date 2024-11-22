import mongoose from "mongoose";

const discountSchema = new mongoose.Schema({
  code: { 
    type: String, 
    required: true,
    unique: true 
  },
  percentage: { 
    type: Number, 
    required: true,
    min: 0,
    max: 100 
  },
  validFrom: { 
    type: Date, 
    required: true 
  },
  validUntil: { 
    type: Date, 
    required: true 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, { timestamps: true });

export default mongoose.model("Discount", discountSchema); 