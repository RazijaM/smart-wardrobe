const db = require('../database');

db.run(`
  CREATE TABLE IF NOT EXISTS trips (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    destination TEXT NOT NULL,
    dateFrom TEXT,
    dateTo TEXT,
    preferences TEXT,
    ownerId INTEGER NOT NULL,
    FOREIGN KEY (ownerId) REFERENCES users(id)
  )
`);

db.close();
