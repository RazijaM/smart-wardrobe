const db = require('../db/database');

class Clothes {
  static getAllByOwner(ownerId, category, callback) {
    if (typeof category === 'function') {
      callback = category;
      category = null;
    }
    let sql = 'SELECT * FROM clothes WHERE ownerId = ?';
    const params = [ownerId];
    if (category && category !== 'all') {
      sql += ' AND category = ?';
      params.push(category);
    }
    db.all(sql, params, callback);
  }

  static getById(id, ownerId, callback) {
    db.get('SELECT * FROM clothes WHERE id = ? AND ownerId = ?', [id, ownerId], callback);
  }

  static create(cloth, callback) {
    const { name, category, color, season, style, size, material, warmthLevel, imagePath, ownerId } = cloth;
    db.run(
      'INSERT INTO clothes (name, category, color, season, style, size, material, warmthLevel, imagePath, ownerId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name || '', category || '', color || '', season || '', style || '', size || '', material || '', warmthLevel || null, imagePath || null, ownerId],
      function (err) {
        if (err) return callback(err);
        callback(null, { id: this.lastID, name, category, color, season, style, size, material, warmthLevel, imagePath, ownerId });
      }
    );
  }

  static update(id, ownerId, updated, callback) {
    const { name, category, color, season, style, size, material, warmthLevel, imagePath } = updated;
    db.run(
      'UPDATE clothes SET name=?, category=?, color=?, season=?, style=?, size=?, material=?, warmthLevel=?, imagePath=? WHERE id=? AND ownerId=?',
      [name, category, color, season, style, size, material, warmthLevel, imagePath, id, ownerId],
      function (err) {
        if (err) return callback(err);
        if (this.changes === 0) return callback(null, null);
        callback(null, { id, ...updated, ownerId });
      }
    );
  }

  static delete(id, ownerId, callback) {
    db.get('SELECT * FROM clothes WHERE id = ? AND ownerId = ?', [id, ownerId], (err, row) => {
      if (err) return callback(err);
      if (!row) return callback(null, null);
      db.run('DELETE FROM clothes WHERE id = ? AND ownerId = ?', [id, ownerId], function (err2) {
        if (err2) return callback(err2);
        callback(null, row);
      });
    });
  }

  static getByCategoryStats(ownerId, callback) {
    db.all('SELECT category, COUNT(*) as count FROM clothes WHERE ownerId = ? GROUP BY category', [ownerId], (err, rows) => {
      if (err) return callback(err);
      callback(null, rows || []);
    });
  }

  static getColorDistribution(ownerId, callback) {
    db.all('SELECT color, COUNT(*) as count FROM clothes WHERE ownerId = ? AND color IS NOT NULL GROUP BY color', [ownerId], (err, rows) => {
      if (err) return callback(err);
      callback(null, rows || []);
    });
  }

  static getSeasonalUsage(ownerId, callback) {
    db.all('SELECT season, COUNT(*) as count FROM clothes WHERE ownerId = ? AND season IS NOT NULL GROUP BY season', [ownerId], (err, rows) => {
      if (err) return callback(err);
      callback(null, rows || []);
    });
  }

  static getByOwnerForPacking(ownerId, season, warmthMin, warmthMax, callback) {
    let sql = 'SELECT * FROM clothes WHERE ownerId = ?';
    const params = [ownerId];
    if (season) {
      const seasonValues = ['All'];
      // Canonical English seasons from trip logic
      if (season === 'Spring' || season === 'Proljeće' || season === 'Proljece') {
        seasonValues.push('Spring', 'Proljeće', 'Proljece');
      } else if (season === 'Summer' || season === 'Ljeto') {
        seasonValues.push('Summer', 'Ljeto');
      } else if (season === 'Autumn' || season === 'Fall' || season === 'Jesen') {
        seasonValues.push('Autumn', 'Fall', 'Jesen');
      } else if (season === 'Winter' || season === 'Zima') {
        seasonValues.push('Winter', 'Zima');
      } else {
        seasonValues.push(season);
      }
      const placeholders = seasonValues.map(() => '?').join(',');
      sql += ` AND (season IS NULL OR season IN (${placeholders}))`;
      params.push(...seasonValues);
    }
    if (warmthMin != null && warmthMax != null) {
      sql += ' AND (warmthLevel IS NULL OR (warmthLevel >= ? AND warmthLevel <= ?))';
      params.push(warmthMin, warmthMax);
    }
    sql += ' ORDER BY category, name';
    db.all(sql, params, callback);
  }
}

module.exports = Clothes;
