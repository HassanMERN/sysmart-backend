const jwt = require("jsonwebtoken");
const DBInitializer = require("../../db/connection");
const { sendErrorResponse } = require("../utils/sendResponse");
const UserModel = require("../services/users/users.model");
const RolesModel = require("../services/roles/roles.model");
const constants = require("../utils/constants");

module.exports = async (req, res, next) => {
  try {
    const db = await DBInitializer();
    const User = new UserModel(db.models.User);
    const Role = new RolesModel(db.models.Role);

    if (!req.headers.authorization) {
      return sendErrorResponse(res, 401, "Authentication required");
    }
    const token =
      req.headers.authorization.split(" ")[1] || req.headers.authorization;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const user = await User.getUser({ email: decoded.email });
      if (!user) {
        return sendErrorResponse(res, 401, "Authentication Failed");
      }
      req.user = decoded;
    } catch (err) {
      return res.status(401).send("Invalid Token");
    }
    return next();
  } catch (e) {
    return sendErrorResponse(res, 401, "Authentication Failed", e);
  }
};
