const express = require('express');
const authenticateToken = require('../middlewares/authMiddleware');
const outfitsController = require('../controllers/outfitsController');

const router = express.Router();

router.use(authenticateToken);

router.get('/', outfitsController.getAll);
router.get('/:id', outfitsController.getById);
router.post('/', outfitsController.create);
router.put('/:id', outfitsController.update);
router.delete('/:id', outfitsController.delete);

module.exports = router;
