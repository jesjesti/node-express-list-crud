const jwt = require("jsonwebtoken");

exports.authenticateJWT = (req, res, next) => {
  if (req.headers && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    jwt.verify(token, "SECRET-TOKEN", function (err, decode) {
      if (err) req.user = undefined;
      req.user = decode;
      next();
    });
  } else {
    return res.status(401).json({ message: "Unauthorized user!!", data: null });
  }
};
