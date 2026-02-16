const express = require('express');
const multer = require('multer');
const path = require('path');
const authenticateToken = require('../middlewares/authMiddleware');
const clothesController = require('../controllers/clothesController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + (file.originalname || 'img').replace(/[^a-zA-Z0-9.-]/g, '_')),
});
const uploadMw = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

const router = express.Router();

router.use(authenticateToken);

router.get('/', clothesController.getAll);
router.get('/:id', clothesController.getById);
router.post('/', uploadMw.single('image'), clothesController.create);
router.put('/:id', uploadMw.single('image'), clothesController.update);
router.delete('/:id', clothesController.delete);

module.exports = router;
