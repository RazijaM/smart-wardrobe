const db = require('../database');

db.run(`
  CREATE TABLE IF NOT EXISTS clothes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT,
    color TEXT,
    season TEXT,
    style TEXT,
    size TEXT,
    material TEXT,
    warmthLevel INTEGER,
    imagePath TEXT,
    ownerId INTEGER NOT NULL,
    FOREIGN KEY (ownerId) REFERENCES users(id)
  )
`);

db.close();
