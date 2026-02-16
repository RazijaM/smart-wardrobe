const db = require('../db/database');

class Trips {
  static getAllByOwner(ownerId, callback) {
    db.all('SELECT * FROM trips WHERE ownerId = ? ORDER BY dateFrom', [ownerId], callback);
  }

  static getById(id, ownerId, callback) {
    db.get('SELECT * FROM trips WHERE id = ? AND ownerId = ?', [id, ownerId], callback);
  }

  static create(trip, callback) {
    const { destination, dateFrom, dateTo, preferences, ownerId } = trip;
    db.run('INSERT INTO trips (destination, dateFrom, dateTo, preferences, ownerId) VALUES (?, ?, ?, ?, ?)',
      [destination, dateFrom, dateTo, preferences || null, ownerId], function (err) {
        if (err) return callback(err);
        callback(null, { id: this.lastID, destination, dateFrom, dateTo, preferences, ownerId });
      });
  }

  static update(id, ownerId, updated, callback) {
    const { destination, dateFrom, dateTo, preferences } = updated;
    db.run('UPDATE trips SET destination=?, dateFrom=?, dateTo=?, preferences=? WHERE id=? AND ownerId=?',
      [destination, dateFrom, dateTo, preferences, id, ownerId], function (err) {
        if (err) return callback(err);
        if (this.changes === 0) return callback(null, null);
        callback(null, { id, destination, dateFrom, dateTo, preferences, ownerId });
      });
  }

  static delete(id, ownerId, callback) {
    db.get('SELECT * FROM trips WHERE id = ? AND ownerId = ?', [id, ownerId], (err, trip) => {
      if (err) return callback(err);
      if (!trip) return callback(null, null);
      db.run('DELETE FROM trips WHERE id = ? AND ownerId = ?', [id, ownerId], function (err2) {
        if (err2) return callback(err2);
        callback(null, trip);
      });
    });
  }
}

module.exports = Trips;
