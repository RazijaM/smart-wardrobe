const express = require('express');
const newsController = require('../controllers/newsController');

const router = express.Router();

// Public routes - no auth required (guests can view published news)
router.get('/', newsController.getAllPublic);
router.get('/:id', newsController.getByIdPublic);

module.exports = router;
