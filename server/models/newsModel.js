const db = require('../db/database');

class News {
  static getAllPublic(callback) {
    db.all('SELECT * FROM news WHERE isPublished = 1 ORDER BY publishedAt DESC', callback);
  }

  static getByIdPublic(id, callback) {
    db.get('SELECT * FROM news WHERE id = ? AND isPublished = 1', [id], callback);
  }

  static getAll(callback) {
    db.all('SELECT * FROM news ORDER BY publishedAt DESC', callback);
  }

  static getById(id, callback) {
    db.get('SELECT * FROM news WHERE id = ?', [id], callback);
  }

  static create(news, callback) {
    const { title, content, imagePath, tags, publishedAt, isPublished } = news;
    db.run('INSERT INTO news (title, content, imagePath, tags, publishedAt, isPublished) VALUES (?, ?, ?, ?, ?, ?)',
      [title, content || null, imagePath || null, tags || null, publishedAt || null, isPublished ? 1 : 0],
      function (err) {
        if (err) return callback(err);
        callback(null, { id: this.lastID, title, content, imagePath, tags, publishedAt, isPublished: !!isPublished });
      });
  }

  static update(id, updated, callback) {
    const { title, content, imagePath, tags, publishedAt, isPublished } = updated;
    db.run('UPDATE news SET title=?, content=?, imagePath=?, tags=?, publishedAt=?, isPublished=? WHERE id=?',
      [title, content, imagePath, tags, publishedAt, isPublished ? 1 : 0, id], function (err) {
        if (err) return callback(err);
        if (this.changes === 0) return callback(null, null);
        callback(null, { id, title, content, imagePath, tags, publishedAt, isPublished: !!isPublished });
      });
  }

  static delete(id, callback) {
    db.get('SELECT * FROM news WHERE id = ?', [id], (err, news) => {
      if (err) return callback(err);
      if (!news) return callback(null, null);
      db.run('DELETE FROM news WHERE id = ?', [id], function (err2) {
        if (err2) return callback(err2);
        callback(null, news);
      });
    });
  }
}

module.exports = News;
