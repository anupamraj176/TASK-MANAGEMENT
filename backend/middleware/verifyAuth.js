const jwt = require('jsonwebtoken');

const verifyAuth = (req, res, next) => {
  let token = req.cookies && req.cookies.token;

  // Fallback 1: check standard authorization header (Bearer token)
  if (!token && req.headers && req.headers.authorization) {
    const parts = req.headers.authorization.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      token = parts[1];
    }
  }

  // Fallback 2: check cookie string in headers
  if (!token && req.headers && req.headers.cookie) {
    const cookies = req.headers.cookie.split(';').map((cookie) => cookie.trim());
    const tokenCookie = cookies.find((cookie) => cookie.startsWith('token='));
    if (tokenCookie) {
      token = decodeURIComponent(tokenCookie.substring('token='.length));
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized - no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ success: false, message: 'Unauthorized - invalid token' });
    }

    req.userId = decoded.userId;
    req.userRole = decoded.role;
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };
    next();
  } catch (error) {
    console.error('Error in verifyAuth:', error);
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

module.exports = { verifyAuth };
