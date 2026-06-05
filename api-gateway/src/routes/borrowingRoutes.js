const express = require('express');
const router = express.Router();
const {
  createBorrowRequest,
  getMyBorrowings,
} = require('../controllers/borrowingController');

router.post('/', createBorrowRequest);
router.get('/my-borrowings', getMyBorrowings);

module.exports = router;