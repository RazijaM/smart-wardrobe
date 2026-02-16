const db = require('../database');

db.serialize(() => {
  db.get("PRAGMA table_info(users)", (err, row) => {
    if (err) {
      console.error(err);
      db.close();
      return;
    }
    db.all("PRAGMA table_info(users)", (err, columns) => {
      if (err) {
        console.error(err);
        db.close();
        return;
      }
      const hasRole = columns.some((c) => c.name === 'role');
      if (!hasRole) {
        db.run('ALTER TABLE users ADD COLUMN role TEXT DEFAULT ?', ['USER'], (err) => {
          if (err) console.error('Error adding role column:', err);
          else console.log('Added role column to users');
          db.close();
        });
      } else {
        db.close();
      }
    });
  });
});
