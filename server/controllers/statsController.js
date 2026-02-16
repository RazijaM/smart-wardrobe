const Wears = require('../models/wearsModel');
const Clothes = require('../models/clothesModel');
const Outfits = require('../models/outfitsModel');

const statsController = {
  clothesByCategory: (req, res) => {
    const ownerId = req.user.id;
    Clothes.getByCategoryStats(ownerId, (err, data) => {
      if (err) return res.status(500).json({ error: 'Error fetching stats.' });
      res.json(data || []);
    });
  },

  mostWorn: (req, res) => {
    const ownerId = req.user.id;
    const limit = parseInt(req.query.limit, 10) || 10;
    Outfits.getMostUsedInOutfits(ownerId, limit, (err, items) => {
      if (err) return res.status(500).json({ error: 'Error fetching stats.' });
      res.json(items || []);
    });
  },

  colorDistribution: (req, res) => {
    const ownerId = req.user.id;
    Clothes.getColorDistribution(ownerId, (err, data) => {
      if (err) return res.status(500).json({ error: 'Error fetching stats.' });
      res.json(data || []);
    });
  },

  seasonalUsage: (req, res) => {
    const ownerId = req.user.id;
    Clothes.getSeasonalUsage(ownerId, (err, data) => {
      if (err) return res.status(500).json({ error: 'Error fetching stats.' });
      res.json(data || []);
    });
  },

  all: (req, res) => {
    const ownerId = req.user.id;
    const callbacks = {
      byCategory: (cb) => Clothes.getByCategoryStats(ownerId, cb),
      mostWorn: (cb) => Outfits.getMostUsedInOutfits(ownerId, 10, cb),
      colorDistribution: (cb) => Clothes.getColorDistribution(ownerId, cb),
      seasonalUsage: (cb) => Clothes.getSeasonalUsage(ownerId, cb),
    };
    const keys = Object.keys(callbacks);
    const results = {};
    let pending = keys.length;
    keys.forEach((k) => {
      callbacks[k]((err, data) => {
        if (err) return res.status(500).json({ error: 'Error fetching stats.' });
        results[k] = data;
        pending--;
        if (pending === 0) res.json(results);
      });
    });
  },
};

module.exports = statsController;
