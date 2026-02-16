// Initialize database: create all tables
// Usage: node scripts/initDb.js (from server folder)
// Then run: node db/seed.js for sample data

const db = require('../db/database');

const schemes = [
  `CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT, role TEXT DEFAULT 'USER')`,
  `CREATE TABLE IF NOT EXISTS clothes (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, category TEXT, color TEXT, season TEXT, style TEXT, size TEXT, material TEXT, warmthLevel INTEGER, imagePath TEXT, ownerId INTEGER NOT NULL, FOREIGN KEY (ownerId) REFERENCES users(id))`,
  `CREATE TABLE IF NOT EXISTS outfits (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, occasion TEXT, season TEXT, ownerId INTEGER NOT NULL, FOREIGN KEY (ownerId) REFERENCES users(id))`,
  `CREATE TABLE IF NOT EXISTS outfit_items (id INTEGER PRIMARY KEY AUTOINCREMENT, outfitId INTEGER NOT NULL, clothingId INTEGER NOT NULL, FOREIGN KEY (outfitId) REFERENCES outfits(id) ON DELETE CASCADE, FOREIGN KEY (clothingId) REFERENCES clothes(id) ON DELETE CASCADE, UNIQUE(outfitId, clothingId))`,
  `CREATE TABLE IF NOT EXISTS trips (id INTEGER PRIMARY KEY AUTOINCREMENT, destination TEXT NOT NULL, dateFrom TEXT, dateTo TEXT, preferences TEXT, ownerId INTEGER NOT NULL, FOREIGN KEY (ownerId) REFERENCES users(id))`,
  `CREATE TABLE IF NOT EXISTS news (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, content TEXT, imagePath TEXT, tags TEXT, publishedAt TEXT, isPublished INTEGER DEFAULT 0)`,
  `CREATE TABLE IF NOT EXISTS wears (id INTEGER PRIMARY KEY AUTOINCREMENT, clothingId INTEGER NOT NULL, wornAt TEXT DEFAULT CURRENT_TIMESTAMP, ownerId INTEGER NOT NULL, FOREIGN KEY (clothingId) REFERENCES clothes(id) ON DELETE CASCADE, FOREIGN KEY (ownerId) REFERENCES users(id))`,
];

db.serialize(() => {
  schemes.forEach((sql) => {
    db.run(sql, (err) => {
      if (err) console.error(err);
    });
  });
  db.all('PRAGMA table_info(users)', (err, rows) => {
    const hasRole = rows && rows.some((r) => r.name === 'role');
    if (!hasRole) {
      db.run('ALTER TABLE users ADD COLUMN role TEXT DEFAULT ?', ['USER'], () => {});
    }
    console.log('Database initialized.');
    db.close();
  });
});
