const jwt = require("jsonwebtoken");

exports.isAdmin = async (token, role) => {
  const decode = await jwt.decode(token, { complete: true })?.payload;
  if (decode.role === role) {
    return true;
  } else {
    return false;
  }
};

