const Outfits = require('../models/outfitsModel');

const outfitsController = {
  getAll: (req, res) => {
    const ownerId = req.user.id;
    Outfits.getAllByOwner(ownerId, (err, outfits) => {
      if (err) return res.status(500).json({ error: 'Error fetching outfits.' });
      res.json(outfits);
    });
  },

  getById: (req, res) => {
    const id = req.params.id;
    const ownerId = req.user.id;
    Outfits.getById(id, ownerId, (err, outfit) => {
      if (err) return res.status(500).json({ error: 'Error fetching outfit.' });
      if (!outfit) return res.status(404).json({ error: 'Outfit not found' });
      res.json(outfit);
    });
  },

  create: (req, res) => {
    const { name, occasion, season, clothingIds } = req.body;
    const ownerId = req.user.id;
    Outfits.create({ name, occasion, season, ownerId, clothingIds: clothingIds || [] }, (err, created) => {
      if (err) return res.status(500).json({ error: 'Error creating outfit.' });
      res.status(201).json(created);
    });
  },

  update: (req, res) => {
    const id = req.params.id;
    const ownerId = req.user.id;
    Outfits.update(id, ownerId, req.body, (err, updated) => {
      if (err) return res.status(500).json({ error: 'Error updating outfit.' });
      if (!updated) return res.status(404).json({ error: 'Outfit not found' });
      res.json(updated);
    });
  },

  delete: (req, res) => {
    const id = req.params.id;
    const ownerId = req.user.id;
    Outfits.delete(id, ownerId, (err, deleted) => {
      if (err) return res.status(500).json({ error: 'Error deleting outfit.' });
      if (!deleted) return res.status(404).json({ error: 'Outfit not found' });
      res.json(deleted);
    });
  },
};

module.exports = outfitsController;
