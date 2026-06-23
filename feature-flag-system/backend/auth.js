const jwt = require('jsonwebtoken');

const SECRET = 'supersecretkey123';

// Create a token when user logs in
function generateToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role, org_id: user.org_id },
    SECRET,
    { expiresIn: '24h' }
  );
}

// Check if token is valid
function verifyToken(req, res, next) {
  const token = req.headers['authorization'];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = { generateToken, verifyToken };