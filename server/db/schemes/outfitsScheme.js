const db = require('../database');

db.serialize(() => {
  db.run(`
  CREATE TABLE IF NOT EXISTS outfits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    occasion TEXT,
    season TEXT,
    ownerId INTEGER NOT NULL,
    FOREIGN KEY (ownerId) REFERENCES users(id)
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS outfit_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    outfitId INTEGER NOT NULL,
    clothingId INTEGER NOT NULL,
    FOREIGN KEY (outfitId) REFERENCES outfits(id) ON DELETE CASCADE,
    FOREIGN KEY (clothingId) REFERENCES clothes(id) ON DELETE CASCADE,
    UNIQUE(outfitId, clothingId)
  )
`, () => db.close());
});
