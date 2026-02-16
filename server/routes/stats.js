const express = require('express');
const authenticateToken = require('../middlewares/authMiddleware');
const statsController = require('../controllers/statsController');

const router = express.Router();

router.use(authenticateToken);

router.get('/', statsController.all);
router.get('/by-category', statsController.clothesByCategory);
router.get('/most-worn', statsController.mostWorn);
router.get('/color-distribution', statsController.colorDistribution);
router.get('/seasonal-usage', statsController.seasonalUsage);

module.exports = router;
