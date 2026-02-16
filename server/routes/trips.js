const express = require('express');
const authenticateToken = require('../middlewares/authMiddleware');
const tripsController = require('../controllers/tripsController');

const router = express.Router();

router.use(authenticateToken);

router.get('/', tripsController.getAll);
router.get('/weather/current', tripsController.getCurrentWeather);
router.get('/weather', tripsController.getWeather);
router.get('/:id/packing', tripsController.getPackingRecommendation);
router.get('/:id', tripsController.getById);
router.post('/', tripsController.create);
router.put('/:id', tripsController.update);
router.delete('/:id', tripsController.delete);

module.exports = router;
