const express = require("express");
const Auth = require("../middlewares/Auth");
const UserController = require("../controllers/users.controller");
const can = require('../middlewares/canAccess');
const Constants = require('../utils/constants');
const router = express.Router();

router.get(
  "/",
  Auth,
  can(Constants.PERMISSION_VIEW_ALL_USERS),
  UserController.users
);
router.get(
  "/get-user-by-email/:email",
  Auth,
  can(Constants.PERMISSION_VIEW_ALL_USERS),
  UserController.getUserByEmail
);
router.get(
  "/get-user-by-id/:id",
  Auth,
  can(Constants.PERMISSION_VIEW_ALL_USERS),
  UserController.getUserById
);
router.post(
  "/create-user",
  Auth,
  can(Constants.PERMISSION_VIEW_ALL_USERS),
  UserController.createUser
);
router.put(
  "/update-user",
  Auth,
  can(Constants.PERMISSION_VIEW_ALL_USERS),
  UserController.updateUser
);
router.delete(
  "/delete-user/:id",
  Auth,
  can(Constants.PERMISSION_VIEW_ALL_USERS),
  UserController.deleteUser
);

module.exports = router;
