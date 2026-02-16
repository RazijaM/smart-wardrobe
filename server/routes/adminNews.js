const express = require('express');
const authenticateToken = require('../middlewares/authMiddleware');
const { requireAdmin } = require('../middlewares/roleMiddleware');
const newsController = require('../controllers/newsController');

const router = express.Router();

router.use(authenticateToken);
router.use(requireAdmin);

router.get('/', newsController.getAllAdmin);
router.get('/:id', newsController.getByIdAdmin);
router.post('/', newsController.create);
router.put('/:id', newsController.update);
router.delete('/:id', newsController.delete);

module.exports = router;
