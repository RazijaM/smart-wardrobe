const News = require('../models/newsModel');

const newsController = {
  getAllPublic: (req, res) => {
    News.getAllPublic((err, news) => {
      if (err) return res.status(500).json({ error: 'Error fetching news.' });
      res.json(news);
    });
  },

  getByIdPublic: (req, res) => {
    const id = req.params.id;
    News.getByIdPublic(id, (err, item) => {
      if (err) return res.status(500).json({ error: 'Error fetching news.' });
      if (!item) return res.status(404).json({ error: 'News not found' });
      res.json(item);
    });
  },

  getAllAdmin: (req, res) => {
    News.getAll((err, news) => {
      if (err) return res.status(500).json({ error: 'Error fetching news.' });
      res.json(news);
    });
  },

  getByIdAdmin: (req, res) => {
    const id = req.params.id;
    News.getById(id, (err, item) => {
      if (err) return res.status(500).json({ error: 'Error fetching news.' });
      if (!item) return res.status(404).json({ error: 'News not found' });
      res.json(item);
    });
  },

  create: (req, res) => {
    News.create(req.body, (err, created) => {
      if (err) return res.status(500).json({ error: 'Error creating news.' });
      res.status(201).json(created);
    });
  },

  update: (req, res) => {
    const id = req.params.id;
    News.update(id, req.body, (err, updated) => {
      if (err) return res.status(500).json({ error: 'Error updating news.' });
      if (!updated) return res.status(404).json({ error: 'News not found' });
      res.json(updated);
    });
  },

  delete: (req, res) => {
    const id = req.params.id;
    News.delete(id, (err, deleted) => {
      if (err) return res.status(500).json({ error: 'Error deleting news.' });
      if (!deleted) return res.status(404).json({ error: 'News not found' });
      res.json(deleted);
    });
  },
};

module.exports = newsController;
