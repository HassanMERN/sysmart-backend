const express = require("express");
const Auth = require("../middlewares/Auth");
const StoreController = require("../controllers/store.controller");
const can = require("../middlewares/canAccess");
const Constants = require("../utils/constants");
const router = express.Router();

router.get(
  "/find/:id",
  Auth,
  can(Constants.PERMISSION_VIEW_A_STORE),
  StoreController.getStoreById
);
router.get(
  "/get-user-stores",
  Auth,
  can(Constants.PERMISSION_VIEW_A_STORE),
  StoreController.getUserStores
);
router.post(
  "/create-store",
  Auth,
  can(Constants.PERMISSION_CREATE_A_STORE),
  StoreController.createStore
);
router.put(
  "/update-store/:id",
  Auth,
  can(Constants.PERMISSION_UPDATE_A_STORE),
  StoreController.updateStorebyId
);
router.delete(
  "/delete-store/:id",
  Auth,
  can(Constants.PERMISSION_DELETE_A_STORE),
  StoreController.deleteStore
);

module.exports = router;
