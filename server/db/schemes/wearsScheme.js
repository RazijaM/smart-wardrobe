const db = require('../database');

db.run(`
  CREATE TABLE IF NOT EXISTS wears (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    clothingId INTEGER NOT NULL,
    wornAt TEXT DEFAULT CURRENT_TIMESTAMP,
    ownerId INTEGER NOT NULL,
    FOREIGN KEY (clothingId) REFERENCES clothes(id) ON DELETE CASCADE,
    FOREIGN KEY (ownerId) REFERENCES users(id)
  )
`);

db.close();
