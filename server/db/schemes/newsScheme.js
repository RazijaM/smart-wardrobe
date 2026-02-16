const db = require('../database');

db.run(`
  CREATE TABLE IF NOT EXISTS news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT,
    imagePath TEXT,
    tags TEXT,
    publishedAt TEXT,
    isPublished INTEGER DEFAULT 0
  )
`);

db.close();
