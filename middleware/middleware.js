const jwt = require("jsonwebtoken");

require('dotenv').config();


let verifyToken = (req, res, next) => {
  let token = req.headers?.authorization && req.headers?.authorization?.split(' ')[1]; //req.headers["authorization"].split(" ")[1];
  if (!token) {
    return res.status(403).send({ message: "Veillez ajouter un token..!" });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
 // console.log(token);   
    if (err) {
      return res.status(401).send({ message: "Accès non authorisé!" });
    }
    req.userId = decoded.id;
    next();
  });
};


module.exports = verifyToken;