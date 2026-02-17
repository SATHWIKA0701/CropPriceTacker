import Market from '../models/Market.js';

export const getMarkets = async (req, res) => {
  try {
    const { state, district, page = 1, limit = 50 } = req.query;

    let filter = {};
    if (state) filter.state = state;
    if (district) filter.district = district;

    const skip = (page - 1) * limit;

    const markets = await Market.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ name: 1 });

    const total = await Market.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: markets.length,
      total,
      markets,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMarketById = async (req, res) => {
  try {
    const market = await Market.findById(req.params.id);

    if (!market) {
      return res.status(404).json({ success: false, message: 'Market not found' });
    }

    res.status(200).json({ success: true, market });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createMarket = async (req, res) => {
  try {
    const { name, state, district, mandal } = req.body;

    if (!name || !state || !district) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const market = await Market.create({
      name,
      state,
      district,
      mandal,
    });

    res.status(201).json({ success: true, market });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateMarket = async (req, res) => {
  try {
    let market = await Market.findById(req.params.id);

    if (!market) {
      return res.status(404).json({ success: false, message: 'Market not found' });
    }

    market = await Market.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, market });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteMarket = async (req, res) => {
  try {
    const market = await Market.findByIdAndDelete(req.params.id);

    if (!market) {
      return res.status(404).json({ success: false, message: 'Market not found' });
    }

    res.status(200).json({ success: true, message: 'Market deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
