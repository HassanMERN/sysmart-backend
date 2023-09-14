const authRouter = require("./auth.route");
const userRouter = require("./users.route");
const storeRouter = require("./store.route");
const storeItemRoutes = require("./store-item.routes");
const purchaseOrderRoutes = require("./purchase-order.routes");
const cartRoutes = require("./cart.routes");
const express = require("express");
const { sendErrorResponse } = require("../utils/sendResponse");

module.exports = (app) => {
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use("/api/auth", authRouter);
  app.use("/api/users", userRouter);
  app.use("/api/stores", storeRouter);
  app.use("/api/store-items", storeItemRoutes);
  app.use("/api/purchase-orders", purchaseOrderRoutes);
  app.use("/api/cart", cartRoutes);
};
