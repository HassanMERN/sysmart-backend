const express = require("express");
const Auth = require("../middlewares/Auth");
const CartController = require("../controllers/cart.controller");
const constants = require("../utils/constants");
const can = require("../middlewares/canAccess");
const router = express.Router();

router.get(
  "/my-cart/",
  Auth,
  can(constants.PERMISSION_VIEW_A_PURCHASE_ORDER),
  CartController.getMyCart
);

router.post(
  "/create-cart-item",
  Auth,
  can(constants.PERMISSION_CREATE_A_PURCHASE_ORDER),
  CartController.createCartItem
);

router.post(
  "/buy-cart-item/:id",
  Auth,
  can(constants.PERMISSION_CREATE_A_PURCHASE_ORDER),
  CartController.buyCartItem
);

router.delete(
  "/delete-cart-item/:id",
  Auth,
  can(constants.PERMISSION_CREATE_A_PURCHASE_ORDER),
  CartController.deleteCartItem
);

module.exports = router;
