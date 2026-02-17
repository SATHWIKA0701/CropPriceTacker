import mongoose from 'mongoose';

const priceSchema = new mongoose.Schema(
  {
    marketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Market',
      required: [true, 'Please provide market ID'],
    },
    cropId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Crop',
      required: [true, 'Please provide crop ID'],
    },
    date: {
      type: Date,
      required: [true, 'Please provide date'],
      default: Date.now,
    },
    price: {
      type: Number,
      required: [true, 'Please provide price'],
      min: [0, 'Price cannot be negative'],
    },
  },
  { timestamps: true }
);

// Index for faster queries and prevent duplicates
priceSchema.index({ marketId: 1, cropId: 1, date: 1 }, { unique: true });

const Price = mongoose.model('Price', priceSchema);
export default Price;
