const Clothes = require('../models/clothesModel');

const clothesController = {
  getAll: (req, res) => {
    const ownerId = req.user.id;
    const category = req.query.category;
    Clothes.getAllByOwner(ownerId, category, (err, clothes) => {
      if (err) return res.status(500).json({ error: 'Error fetching clothes.' });
      res.json(clothes || []);
    });
  },

  getById: (req, res) => {
    const id = req.params.id;
    const ownerId = req.user.id;
    Clothes.getById(id, ownerId, (err, cloth) => {
      if (err) return res.status(500).json({ error: 'Error fetching cloth.' });
      if (!cloth) return res.status(404).json({ error: 'Cloth not found' });
      res.json(cloth);
    });
  },

  create: (req, res) => {
    const ownerId = req.user.id;
    const imagePath = req.file ? '/uploads/' + req.file.filename : (req.body.imagePath || null);
    Clothes.create({ ...req.body, imagePath, ownerId }, (err, created) => {
      if (err) return res.status(500).json({ error: 'Error creating cloth.' });
      res.status(201).json(created);
    });
  },

  update: (req, res) => {
    const id = req.params.id;
    const ownerId = req.user.id;
    const body = { ...req.body };
    body.imagePath = req.file ? '/uploads/' + req.file.filename : (req.body.imagePath || null);
    Clothes.update(id, ownerId, body, (err, updated) => {
      if (err) return res.status(500).json({ error: 'Error updating cloth.' });
      if (!updated) return res.status(404).json({ error: 'Cloth not found' });
      res.json(updated);
    });
  },

  delete: (req, res) => {
    const id = req.params.id;
    const ownerId = req.user.id;
    Clothes.delete(id, ownerId, (err, deleted) => {
      if (err) return res.status(500).json({ error: 'Error deleting cloth.' });
      if (!deleted) return res.status(404).json({ error: 'Cloth not found' });
      res.json(deleted);
    });
  },
};

module.exports = clothesController;
