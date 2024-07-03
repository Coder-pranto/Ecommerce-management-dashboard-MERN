const jwt = require("jsonwebtoken");

const checkJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ status: "unauthorized access" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
    if (err) {
      return res.status(401).send({ status: "unauthorized access" });
    }
    req.decoded = decoded;

    next();
  });
};
exports.checkJwt = checkJwt;
