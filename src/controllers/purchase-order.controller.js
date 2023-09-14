const {
  sendErrorResponse,
  sendSuccessResponse,
} = require("../utils/sendResponse");
const DBInitializer = require("../../db/connection");
const StoreItemModel = require("../services/store-items/store-item.model");
const StoreModel = require("../services/store/store.model");
const PurchaseOrderModel = require("../services/purchase-order/purchase-order.model");
module.exports = {
  async getPurchaseOrderById(req, res) {
    try {
      let db = await DBInitializer();
      const PurchaseOrder = new PurchaseOrderModel(db.models.PurchaseOrder);
      const { id } = req.params;
      let purchaseOrder = await PurchaseOrder.getPurchaseOrderById(id);
      if (!purchaseOrder) {
        return sendErrorResponse(
          res,
          422,
          "Requested Purchase Order Does Not Exist"
        );
      }
      return sendSuccessResponse(
        res,
        201,
        purchaseOrder,
        "Purchase Order by specified id"
      );
    } catch (e) {
      console.error(e);
      return sendErrorResponse(
        res,
        500,
        "Could not perform operation at this time, kindly try again later.",
        e
      );
    }
  },

  async createPurchaseOrder(req, res) {
    try {
      let db = await DBInitializer();
      const PurchaseOrder = new PurchaseOrderModel(db.models.PurchaseOrder);
      const StoreItem = new StoreItemModel(db.models.StoreItems);
      const userId = req.user.user_id;
      const { id, title, quantity, store_id } = req.body;

      let totalCost;
      let storeItem = await StoreItem.getStoreItemById(id);
      if (!storeItem) {
        return sendErrorResponse(res, 422, "Wrong Store Item Specified");
      } else if (storeItem.dataValues.quantity < quantity) {
        return sendErrorResponse(
          res,
          422,
          `Not enough stock available for store item: ${storeItem.dataValues.title}. Max available: ${storeItem.dataValues.quantity}`
        );
      } else {
        totalCost = quantity * storeItem.dataValues.unit_cost;
        const storeItemRemainingQuantity =
          storeItem.dataValues.quantity - quantity;

        let where = {
          id,
        };

        const toBeUpdated = {
          quantity: storeItemRemainingQuantity,
        };

        await StoreItem.updateStoreItem(toBeUpdated, where);
      }

      let newPurchaseOrder = await PurchaseOrder.createPurchaseOrder({
        id,
        title,
        quantity,
        total_cost: totalCost,
        user_id: userId,
        store_id,
      });

      return sendSuccessResponse(
        res,
        201,
        newPurchaseOrder,
        "Purchase Order created successfully"
      );
    } catch (e) {
      console.error(e);
      return sendErrorResponse(
        res,
        500,
        "Could not perform operation at this time, kindly try again later.",
        e
      );
    }
  },

  async getMyPurchaseOrders(req, res) {
    try {
      let db = await DBInitializer();
      const PurchaseOrder = new PurchaseOrderModel(db.models.PurchaseOrder);
      const userId = req.user.user_id;

      const allPurchaseOrders = await PurchaseOrder.getPurchaseOrders(userId);
      return sendSuccessResponse(
        res,
        201,
        allPurchaseOrders,
        "All Purchase Orders"
      );
    } catch (e) {
      console.error(e);
      return sendErrorResponse(
        res,
        500,
        "Could not perform operation at this time, kindly try again later.",
        e
      );
    }
  },

  async getPurchaseOrdersByUserId(req, res) {
    try {
      let db = await DBInitializer();
      const PurchaseOrder = new PurchaseOrderModel(db.models.PurchaseOrder);
      const { id } = req.params;

      const allPurchaseOrders = await PurchaseOrder.getPurchaseOrders(id);
      return sendSuccessResponse(
        res,
        201,
        allPurchaseOrders,
        "All Purchase Orders of the user"
      );
    } catch (e) {
      console.error(e);
      return sendErrorResponse(
        res,
        500,
        "Could not perform operation at this time, kindly try again later.",
        e
      );
    }
  },

  async getUserSales(req, res) {
    try {
      let db = await DBInitializer();
      const PurchaseOrder = new PurchaseOrderModel(db.models.PurchaseOrder);
      const Store = new StoreModel(db.models.Store);
      const userId = req.user.user_id;
      const where = { user_id: userId };
      const storeOfUser = await Store.getStore(where);

      const store_id = storeOfUser.dataValues.id;
      const allPurchaseOrders = await PurchaseOrder.getPurchaseOrders(store_id);
      return sendSuccessResponse(
        res,
        201,
        allPurchaseOrders,
        "All Purchase Orders of the user"
      );
    } catch (e) {
      console.error(e);
      return sendErrorResponse(
        res,
        500,
        "Could not perform operation at this time, kindly try again later.",
        e
      );
    }
  },
};
