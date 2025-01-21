const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

// Reset the database by deleting all records from the users table
db.serialize(() => {
  // You can add any other necessary database reset logic here
  db.run('DELETE FROM users', (err) => {
    if (err) {
      console.error('Error resetting the database:', err.message);
    } else {
      console.log('Database has been reset.');
    }
  });
});

// Close the database connection
db.close();
