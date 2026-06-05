const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const itemRoutes = require('./itemRoutes');
const borrowingRoutes = require('./borrowingRoutes');
const adminRoutes = require('./adminRoutes');
const { protect, admin } = require('../middlewares/authMiddleware');

router.use('/auth', authRoutes);
router.use('/items', protect, itemRoutes);
router.use('/borrowings', protect, borrowingRoutes);
router.use('/admin', protect, admin, adminRoutes);

module.exports = router;