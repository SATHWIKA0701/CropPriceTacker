import mongoose from 'mongoose';

const marketSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide market name'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'Please provide state'],
      trim: true,
    },
    district: {
      type: String,
      required: [true, 'Please provide district'],
      trim: true,
    },
    mandal: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Index for faster queries
marketSchema.index({ state: 1, district: 1 });

const Market = mongoose.model('Market', marketSchema);
export default Market;
