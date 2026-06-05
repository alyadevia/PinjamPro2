const express = require('express');
const router = express.Router();
const {
  listItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
} = require('../controllers/itemController');
const { admin } = require('../middlewares/authMiddleware');
const upload = require('../utils/fileUploader'); // <-- IMPOR UPLOAD

router.get('/', listItems);
router.get('/:id', getItemById);
router.post('/', admin, upload.single('image'), createItem);
router.put('/:id', admin, upload.single('image'), updateItem);
router.delete('/:id', admin, deleteItem);

module.exports = router;