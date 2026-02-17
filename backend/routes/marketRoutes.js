import express from 'express';
import {
  getMarkets,
  getMarketById,
  createMarket,
  updateMarket,
  deleteMarket,
} from '../controllers/marketController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getMarkets);
router.get('/:id', getMarketById);
router.post('/', protect, authorize('admin'), createMarket);
router.put('/:id', protect, authorize('admin'), updateMarket);
router.delete('/:id', protect, authorize('admin'), deleteMarket);

export default router;
