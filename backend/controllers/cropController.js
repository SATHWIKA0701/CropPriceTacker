import Crop from '../models/Crop.js';

export const getCrops = async (req, res) => {
  try {
    const { category, page = 1, limit = 50 } = req.query;

    let filter = {};
    if (category) filter.category = category;

    const skip = (page - 1) * limit;

    const crops = await Crop.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ name: 1 });

    const total = await Crop.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: crops.length,
      total,
      crops,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCropById = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);

    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop not found' });
    }

    res.status(200).json({ success: true, crop });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createCrop = async (req, res) => {
  try {
    const { name, category, unit } = req.body;

    if (!name || !category) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const crop = await Crop.create({
      name,
      category,
      unit: unit || 'kg',
    });

    res.status(201).json({ success: true, crop });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Crop already exists' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCrop = async (req, res) => {
  try {
    let crop = await Crop.findById(req.params.id);

    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop not found' });
    }

    crop = await Crop.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, crop });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCrop = async (req, res) => {
  try {
    const crop = await Crop.findByIdAndDelete(req.params.id);

    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop not found' });
    }

    res.status(200).json({ success: true, message: 'Crop deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
