const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const db = require('./database');
const { generateToken, verifyToken } = require('./auth');

const app = express();
app.use(cors());
app.use(express.json());


// SUPER ADMIN LOGIN
app.post('/super-admin/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === 'superadmin' && password === 'admin123') {
    const role = db.prepare('SELECT * FROM roles WHERE name = ?').get('super_admin');
    const token = generateToken({ id: 0, role: 'super_admin', role_id: role.id, org_id: null });
    return res.json({ token });
  }
  
  res.status(401).json({ message: 'Invalid credentials' });
});

// ROLES ROUTES

app.get('/roles', (req, res) => {
  const roles = db.prepare('SELECT * FROM roles').all();
  res.json(roles);
});

// ORGANISATION ROUTES

app.post('/organisations', verifyToken, (req, res) => {
  const { name } = req.body;
  
  if (req.user.role !== 'super_admin') {
    return res.status(403).json({ message: 'Not allowed' });
  }
  
  const result = db.prepare('INSERT INTO organisations (name) VALUES (?)').run(name);
  res.json({ id: result.lastInsertRowid, name });
});

app.get('/organisations', verifyToken, (req, res) => {
  const orgs = db.prepare('SELECT * FROM organisations').all();
  res.json(orgs);
});
// ADMIN AUTH ROUTES

app.post('/admin/signup', (req, res) => {
  const { name, email, password, org_id } = req.body;
  
  const hashedPassword = bcrypt.hashSync(password, 10);
  
  // Get admin role id
  const role = db.prepare('SELECT * FROM roles WHERE name = ?').get('admin');
  
  try {
    const result = db.prepare(
      'INSERT INTO users (name, email, password, role_id, org_id) VALUES (?, ?, ?, ?, ?)'
    ).run(name, email, hashedPassword, role.id, org_id);
    
    res.json({ message: 'Signup successful' });
  } catch (err) {
    res.status(400).json({ message: 'Email already exists' });
  }
});

app.post('/admin/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = db.prepare(`
    SELECT users.*, roles.name as role_name 
    FROM users 
    JOIN roles ON users.role_id = roles.id 
    WHERE users.email = ?
  `).get(email);
  
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  const token = generateToken({ 
    id: user.id, 
    role: user.role_name, 
    role_id: user.role_id,
    org_id: user.org_id 
  });
  res.json({ token, org_id: user.org_id });
});

// FEATURE FLAG ROUTES
app.post('/flags', verifyToken, (req, res) => {
  const { key } = req.body;
  const org_id = req.user.org_id;
  
  const result = db.prepare(
    'INSERT INTO feature_flags (key, is_enabled, org_id) VALUES (?, 0, ?)'
  ).run(key, org_id);
  
  res.json({ id: result.lastInsertRowid, key, is_enabled: 0 });
});

app.get('/flags', verifyToken, (req, res) => {
  const org_id = req.user.org_id;
  const flags = db.prepare('SELECT * FROM feature_flags WHERE org_id = ?').all(org_id);
  res.json(flags);
});

app.put('/flags/:id', verifyToken, (req, res) => {
  const { is_enabled } = req.body;
  const { id } = req.params;
  
  db.prepare('UPDATE feature_flags SET is_enabled = ? WHERE id = ?').run(is_enabled, id);
  res.json({ message: 'Flag updated' });
});

app.delete('/flags/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM feature_flags WHERE id = ?').run(id);
  res.json({ message: 'Flag deleted' });
});

// PUBLIC ORGANISATIONS
app.get('/organisations-public', (req, res) => {
  const orgs = db.prepare('SELECT * FROM organisations').all();
  res.json(orgs);
});


// UPDATE FLAG KEY

app.put('/flags/:id/key', verifyToken, (req, res) => {
  const { key } = req.body;
  const { id } = req.params;
  
  db.prepare('UPDATE feature_flags SET key = ? WHERE id = ?').run(key, id);
  res.json({ message: 'Flag key updated' });
});

// END USER CHECK

app.get('/check-flag', (req, res) => {
  const { key, org_id } = req.query;
  
  const flag = db.prepare(
    'SELECT * FROM feature_flags WHERE key = ? AND org_id = ?'
  ).get(key, org_id);
  
  if (!flag) {
    return res.json({ enabled: false, message: 'Flag not found' });
  }
  
  res.json({ enabled: flag.is_enabled === 1 });
});


// START SERVER

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});