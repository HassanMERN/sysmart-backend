const express = require("express");
const Auth = require("../middlewares/Auth");
const PurchaseOrderController = require("../controllers/purchase-order.controller");
const constants = require("../utils/constants");
const can = require("../middlewares/canAccess");
const router = express.Router();

router.get("/find/:id", Auth, PurchaseOrderController.getPurchaseOrderById);

router.get(
  "/user-purchase-orders/:id",
  Auth,
  can(constants.PERMISSION_VIEW_A_PURCHASE_ORDER),
  PurchaseOrderController.getPurchaseOrdersByUserId
);

router.get(
  "/my-purchase-orders/",
  Auth,
  can(constants.PERMISSION_VIEW_A_PURCHASE_ORDER),
  PurchaseOrderController.getMyPurchaseOrders
);

router.get(
  "/my-store-purchase-orders/",
  Auth,
  can(constants.PERMISSION_VIEW_A_PURCHASE_ORDER),
  PurchaseOrderController.getUserSales
);

router.post(
  "/create-purchase-order",
  Auth,
  can(constants.PERMISSION_CREATE_A_PURCHASE_ORDER),
  PurchaseOrderController.createPurchaseOrder
);

module.exports = router;
