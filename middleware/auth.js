const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1]; // Extract the token

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    req.user = decoded; // Attach user data to request
    next(); // Proceed to the next middleware
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

module.exports = auth;
