import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Check if token is passed in headers
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the user object to the request
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

export default authenticateToken;
