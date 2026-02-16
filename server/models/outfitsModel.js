const db = require('../db/database');

class Outfits {
  static getAllByOwner(ownerId, callback) {
    db.all('SELECT * FROM outfits WHERE ownerId = ?', [ownerId], (err, outfits) => {
      if (err) return callback(err);
      if (!outfits || outfits.length === 0) return callback(null, []);
      const ids = outfits.map((o) => o.id);
      const placeholders = ids.map(() => '?').join(',');
      db.all(
        `SELECT oi.*, c.name as clothingName, c.category, c.color, c.imagePath
         FROM outfit_items oi
         JOIN clothes c ON oi.clothingId = c.id
         WHERE oi.outfitId IN (${placeholders})`,
        ids,
        (err2, items) => {
        if (err2) return callback(err2);
        const itemsByOutfit = {};
        (items || []).forEach((i) => {
          if (!itemsByOutfit[i.outfitId]) itemsByOutfit[i.outfitId] = [];
          itemsByOutfit[i.outfitId].push(i);
        });
        outfits.forEach((o) => {
          o.items = itemsByOutfit[o.id] || [];
        });
        callback(null, outfits);
      }
      );
    });
  }

  static getById(id, ownerId, callback) {
    db.get('SELECT * FROM outfits WHERE id = ? AND ownerId = ?', [id, ownerId], (err, outfit) => {
      if (err) return callback(err);
      if (!outfit) return callback(null, null);
      db.all('SELECT oi.*, c.name as clothingName, c.category, c.color, c.season, c.warmthLevel FROM outfit_items oi JOIN clothes c ON oi.clothingId = c.id WHERE oi.outfitId = ?', [id], (err2, items) => {
        if (err2) return callback(err2);
        outfit.items = items || [];
        callback(null, outfit);
      });
    });
  }

  static getMostUsedInOutfits(ownerId, limit, callback) {
    const sql = `
      SELECT c.*, COUNT(oi.id) as wearCount
      FROM outfits o
      JOIN outfit_items oi ON o.id = oi.outfitId
      JOIN clothes c ON oi.clothingId = c.id
      WHERE o.ownerId = ?
      GROUP BY c.id
      ORDER BY wearCount DESC
      LIMIT ?
    `;
    db.all(sql, [ownerId, limit || 10], (err, rows) => {
      if (err) return callback(err);
      callback(null, rows || []);
    });
  }

  static create(outfit, callback) {
    const { name, occasion, season, ownerId, clothingIds } = outfit;
    db.run('INSERT INTO outfits (name, occasion, season, ownerId) VALUES (?, ?, ?, ?)', [name, occasion, season, ownerId], function (err) {
      if (err) return callback(err);
      const outfitId = this.lastID;
      if (clothingIds && clothingIds.length > 0) {
        const stmt = db.prepare('INSERT INTO outfit_items (outfitId, clothingId) VALUES (?, ?)');
        clothingIds.forEach((cid) => stmt.run(outfitId, cid));
        stmt.finalize((err2) => {
          if (err2) return callback(err2);
          callback(null, { id: outfitId, name, occasion, season, ownerId, items: [] });
        });
      } else {
        callback(null, { id: outfitId, name, occasion, season, ownerId, items: [] });
      }
    });
  }

  static update(id, ownerId, updated, callback) {
    const { name, occasion, season, clothingIds } = updated;
    db.run('UPDATE outfits SET name=?, occasion=?, season=? WHERE id=? AND ownerId=?', [name, occasion, season, id, ownerId], function (err) {
      if (err) return callback(err);
      if (this.changes === 0) return callback(null, null);
      db.run('DELETE FROM outfit_items WHERE outfitId = ?', [id], (err2) => {
        if (err2) return callback(err2);
        if (clothingIds && clothingIds.length > 0) {
          const stmt = db.prepare('INSERT INTO outfit_items (outfitId, clothingId) VALUES (?, ?)');
          clothingIds.forEach((cid) => stmt.run(id, cid));
          stmt.finalize((err3) => {
            if (err3) return callback(err3);
            callback(null, { id, name, occasion, season, ownerId });
          });
        } else {
          callback(null, { id, name, occasion, season, ownerId });
        }
      });
    });
  }

  static delete(id, ownerId, callback) {
    db.get('SELECT * FROM outfits WHERE id = ? AND ownerId = ?', [id, ownerId], (err, outfit) => {
      if (err) return callback(err);
      if (!outfit) return callback(null, null);
      db.run('DELETE FROM outfit_items WHERE outfitId = ?', [id], () => {
        db.run('DELETE FROM outfits WHERE id = ? AND ownerId = ?', [id, ownerId], function (err2) {
          if (err2) return callback(err2);
          callback(null, outfit);
        });
      });
    });
  }
}

module.exports = Outfits;
