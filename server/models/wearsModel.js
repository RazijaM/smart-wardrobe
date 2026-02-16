const db = require('../db/database');

class Wears {
  static record(clothingId, ownerId, callback) {
    db.run('INSERT INTO wears (clothingId, ownerId) VALUES (?, ?)', [clothingId, ownerId], function (err) {
      if (err) return callback(err);
      callback(null, { id: this.lastID });
    });
  }

  static getMostWornByOwner(ownerId, limit, callback) {
    const sql = `
      SELECT c.*, COUNT(w.id) as wearCount
      FROM clothes c
      LEFT JOIN wears w ON c.id = w.clothingId
      WHERE c.ownerId = ?
      GROUP BY c.id
      ORDER BY wearCount DESC
      LIMIT ?
    `;
    db.all(sql, [ownerId, limit || 10], callback);
  }
}

module.exports = Wears;
