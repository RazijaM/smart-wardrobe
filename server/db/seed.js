const db = require('./database');

db.serialize(() => {
  // Seed admin user (password: admin123) - run migrations first
  const bcrypt = require('bcryptjs');
  bcrypt.hash('admin123', 10, (err, hash) => {
    if (err) {
      console.error(err);
      db.close();
      return;
    }
    db.run('INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)', ['admin', hash, 'ADMIN'], function (e) {
      if (e) console.error(e);
      else if (this.changes) console.log('Seeded admin user (admin / admin123)');
      db.run(`INSERT INTO news (title, content, imagePath, tags, publishedAt, isPublished) VALUES 
        ('Welcome to Smart Wardrobe', 'Manage your wardrobe, plan outfits, and pack for trips with ease.', NULL, 'welcome,wardrobe', datetime('now'), 1),
        ('Travel Packing Tips', 'Our app uses weather data to suggest what to pack for your destination.', NULL, 'travel,packing', datetime('now'), 1)`, () => db.close());
    });
  });
});
