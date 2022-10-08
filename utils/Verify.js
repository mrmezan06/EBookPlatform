const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json({
      message: "You are not authorized",
    });
  }
  try {
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          message: "Token is not valid",
        });
      }
      req.user = decoded;
      next();
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

exports.verifyUser = (req, res, next) => {
  this.verifyToken(req, res, () => {
    if (req.user.id === req.params.uid || req.user.isAdmin) {
      next();
    } else {
      return res
        .status(403)
        .json({ message: "You are not allowed to do that!" });
    }
  });
};
exports.verifyAdmin = (req, res, next) => {
  this.verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return res
        .status(403)
        .json({ message: "You are not allowed to do that!" });
    }
  });
};
