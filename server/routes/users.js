const express = require('express');
const authenticateToken = require('../middlewares/authMiddleware');
const { requireAdmin } = require('../middlewares/roleMiddleware');
const User = require('../models/userModel');

const router = express.Router();

router.use(authenticateToken);
router.use(requireAdmin);

router.get('/', (req, res) => {
  User.getAll((err, users) => {
    if (err) return res.status(500).json({ error: 'Error fetching users.' });
    res.json(users);
  });
});

module.exports = router;
