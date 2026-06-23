const Database = require('better-sqlite3');

const db = new Database('featureflags.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS organisations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role_id INTEGER,
    org_id INTEGER,
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (org_id) REFERENCES organisations(id)
  );

  CREATE TABLE IF NOT EXISTS feature_flags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT NOT NULL,
    is_enabled INTEGER DEFAULT 0,
    org_id INTEGER,
    FOREIGN KEY (org_id) REFERENCES organisations(id)
  );
`);

// Insert default roles
const insertRole = db.prepare(
  'INSERT OR IGNORE INTO roles (name) VALUES (?)'
);
insertRole.run('super_admin');
insertRole.run('admin');
insertRole.run('end_user');

module.exports = db;