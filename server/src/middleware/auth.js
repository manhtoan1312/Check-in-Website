const jwt = require("jsonwebtoken");
const config = process.env;

const verifyToken = (req, res, next) => {
  const authorizationHeader = req.headers["authorization"];

  if (!authorizationHeader) {
    return res.status(403).json({
      success:false,
      message:"You need to log in to exercise this right"
    });
  }

  const token = authorizationHeader.split(" ")[1];
  if (!token) {
    return res.status(403).json({
      success:false,
      message:"You need to log in to exercise this right"
    });
  }

  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    if(decoded.enable){
      req.user = decoded;
    }
    else{
      return res.status(403).json({
        success:false,
        message:"This account cannot currently log into the system"
      });
    }
  } catch (err) {
    return res.status(401).json({
      success:false,
      message:"Token is incorrect or has expired. Please log in again!!"
    });
  }
  return next();
};

module.exports = verifyToken;
