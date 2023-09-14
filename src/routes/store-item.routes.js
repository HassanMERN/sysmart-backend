const express = require("express");
const Auth = require("../middlewares/Auth");
const StoreItemController = require("../controllers/store-item.controller");
const can = require("../middlewares/canAccess");
const Constants = require("../utils/constants");
const router = express.Router();

router.get(
  "/find/:id",
  Auth,
  can(Constants.PERMISSION_VIEW_A_STORE_ITEM),
  StoreItemController.getStoreItemById
);

router.get(
  "/get-by-store/:id",
  Auth,
  can(Constants.PERMISSION_VIEW_A_STORE_ITEM),
  StoreItemController.getStoreItems
);
router.get(
  "/get-all-store-items",
  Auth,
  can(Constants.PERMISSION_VIEW_A_STORE_ITEM),
  StoreItemController.getAllStoreItems
);
router.get(
  "/get-my-store-items",
  Auth,
  can(Constants.PERMISSION_VIEW_A_STORE_ITEM),
  StoreItemController.getMyStoreItems
);

router.get(
  "/search",
  Auth,
  can(Constants.PERMISSION_VIEW_A_STORE_ITEM),
  StoreItemController.searchItems
);

router.post(
  "/create-store-item",
  Auth,
  can(Constants.PERMISSION_CREATE_A_STORE_ITEM),
  StoreItemController.createStoreItem
);
router.put(
  "/update-store-item/:id",
  Auth,
  can(Constants.PERMISSION_UPDATE_A_STORE_ITEM),
  StoreItemController.updateStoreItembyId
);
router.delete(
  "/delete-store-item/:id",
  Auth,
  can(Constants.PERMISSION_DELETE_A_STORE_ITEM),
  StoreItemController.deleteStoreItem
);

module.exports = router;
