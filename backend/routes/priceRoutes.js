import express from 'express';
import {
  getTodayPrice,
  getPriceHistory,
  createPrice,
  updatePrice,
  deletePrice,
  getPriceStats,
} from '../controllers/priceController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/today/:marketId/:cropId', getTodayPrice);
router.get('/history/:marketId/:cropId/:days', getPriceHistory);
router.get('/stats', getPriceStats);
router.post('/', protect, authorize('admin'), createPrice);
router.put('/:id', protect, authorize('admin'), updatePrice);
router.delete('/:id', protect, authorize('admin'), deletePrice);

export default router;
