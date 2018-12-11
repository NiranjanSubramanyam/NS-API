const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    console.log(token);
    const decoded = jwt.verify(
      token,
      "neighborhood_stores_secret_passcode_for_jwt_signing_DO_NOT_SHARE_WITH_ANYONE",
      (err, result) => {
        if (err) {
          console.log('Error = ' + err);
          return res.status(401).json({
              message: 'Auth failed',
              errorcode: '111' /// 111 - Token expired
          });
      }
      });
    req.userData = decoded;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: "Auth failed",
      errorcode: "2"
    });
  }
};
