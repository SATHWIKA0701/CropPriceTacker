import Price from '../models/Price.js';

export const getTodayPrice = async (req, res) => {
  try {
    const { marketId, cropId } = req.params;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const price = await Price.findOne({
      marketId,
      cropId,
      date: { $gte: today, $lt: tomorrow },
    });

    if (!price) {
      return res.status(404).json({ success: false, message: 'Price data not available' });
    }

    res.status(200).json({ success: true, price });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPriceHistory = async (req, res) => {
  try {
    const { marketId, cropId, days } = req.params;
    const numDays = parseInt(days) || 30;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - numDays);
    startDate.setHours(0, 0, 0, 0);

    const prices = await Price.find({
      marketId,
      cropId,
      date: { $gte: startDate },
    })
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: prices.length,
      prices,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createPrice = async (req, res) => {
  try {
    const { marketId, cropId, date, price } = req.body;

    if (!marketId || !cropId || !date || price === undefined) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const priceEntry = await Price.create({
      marketId,
      cropId,
      date,
      price,
    });

    res.status(201).json({ success: true, price: priceEntry });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Price already exists for this market, crop and date',
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePrice = async (req, res) => {
  try {
    let price = await Price.findById(req.params.id);

    if (!price) {
      return res.status(404).json({ success: false, message: 'Price not found' });
    }

    price = await Price.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, price });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePrice = async (req, res) => {
  try {
    const price = await Price.findByIdAndDelete(req.params.id);

    if (!price) {
      return res.status(404).json({ success: false, message: 'Price not found' });
    }

    res.status(200).json({ success: true, message: 'Price deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPriceStats = async (req, res) => {
  try {
    const { marketId, cropId, days } = req.query;
    const numDays = parseInt(days) || 30;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - numDays);
    startDate.setHours(0, 0, 0, 0);

    const stats = await Price.aggregate([
      {
        $match: {
          marketId: require('mongoose').Types.ObjectId(marketId),
          cropId: require('mongoose').Types.ObjectId(cropId),
          date: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: null,
          avg: { $avg: '$price' },
          min: { $min: '$price' },
          max: { $max: '$price' },
          latest: { $last: '$price' },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      stats: stats[0] || { avg: 0, min: 0, max: 0, latest: 0 },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
