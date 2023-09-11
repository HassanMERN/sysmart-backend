const express = require("express");
const Auth = require("../middlewares/Auth");
const PurchaseOrderController = require("../controllers/purchase-order.controller");
const router = express.Router();

router.get("/:id", Auth, PurchaseOrderController.getPurchaseOrderById);

router.get(
  "/user-purchase-orders/:id",
  Auth,
  PurchaseOrderController.getPurchaseOrdersByUserId
);

router.get(
  "/my-purchase-orders/",
  Auth,
  PurchaseOrderController.getPurchaseOrders
);

router.post(
  "/create-purchase-order",
  Auth,
  PurchaseOrderController.createPurchaseOrder
);

module.exports = router;
