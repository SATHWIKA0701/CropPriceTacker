import mongoose from 'mongoose';

const cropSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide crop name'],
      trim: true,
      unique: true,
    },
    category: {
      type: String,
      enum: ['Cereals', 'Pulses', 'Oilseeds', 'Spices', 'Vegetables', 'Fruits', 'Other'],
      required: [true, 'Please provide crop category'],
    },
    unit: {
      type: String,
      default: 'kg',
    },
  },
  { timestamps: true }
);

const Crop = mongoose.model('Crop', cropSchema);
export default Crop;
