const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Defines the path for the new database file.
const dbPath = path.join(__dirname, '../../database/event.db');
const dir = path.dirname(dbPath);

// Creates the 'database' directory if it doesn't exist.
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Database connection error:', err.message);
  } else {
    console.log('✅ Connected to the SQLite database.');
  }
});

db.serialize(() => {
  // Step 1: Create the table with the core columns if it doesn't exist.
  db.run(`
    CREATE TABLE IF NOT EXISTS participants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      regId TEXT UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) return console.error("❌ Error creating table:", err.message);
    console.log("✅ 'participants' table schema initialized.");

    // Step 2: Check for and add the 'attended' column if it's missing.
    db.run("ALTER TABLE participants ADD COLUMN attended INTEGER DEFAULT 0", (alterErr) => {
        if (alterErr && !alterErr.message.includes("duplicate column name")) {
            console.error("❌ Error adding 'attended' column:", alterErr.message);
        } else {
            console.log("✅ 'attended' column is present.");
        }
    });

    // Step 3: Check for and add the 'timestamp' column if it's missing.
    db.run("ALTER TABLE participants ADD COLUMN timestamp TEXT", (alterErr) => {
        if (alterErr && !alterErr.message.includes("duplicate column name")) {
            console.error("❌ Error adding 'timestamp' column:", alterErr.message);
        } else {
            console.log("✅ 'timestamp' column is present.");
        }
    });
  });
});

module.exports = db;