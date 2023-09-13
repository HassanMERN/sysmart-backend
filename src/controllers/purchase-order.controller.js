const {
  sendErrorResponse,
  sendSuccessResponse,
} = require("../utils/sendResponse");
const DBInitializer = require("../../db/connection");
const StoreItemModel = require("../services/store-items/store-item.model");
const PurchaseOrderModel = require("../services/purchase-order/purchase-order.model");
const PurchaseOrderLineItemModel = require("../services/purchase-order-line-item/purchase-order-line-item.model");

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
      const PurchaseOrderLineItem = new PurchaseOrderLineItemModel(
        db.models.PurchaseOrderLineItem
      );
      const StoreItem = new StoreItemModel(db.models.StoreItems);
      const userId = req.user.user_id;
      let totalCostofPO = 0;
      const lineItem = req.body;
      let id = lineItem.id;
      let storeItem = await StoreItem.getStoreItemById(id);
      if (!storeItem) {
        return sendErrorResponse(res, 422, "Wrong Store Item Specified");
      } else if (storeItem.dataValues.quantity < lineItem.quantity) {
        return sendErrorResponse(
          res,
          422,
          `Not enough stock available for store item: ${storeItem.dataValues.title}. Max available: ${storeItem.dataValues.quantity}`
        );
      } else {
        lineItem.totalCost = lineItem.quantity * storeItem.dataValues.unit_cost; //this property I'm defining here
        lineItem.itemId = storeItem.dataValues.id;
        totalCostofPO += lineItem.totalCost;
        const storeItemRemainingQuantity =
          storeItem.dataValues.quantity - lineItem.quantity;

        let where = {
          id,
        };

        const toBeUpdated = {
          quantity: storeItemRemainingQuantity,
        };

        await StoreItem.updateStoreItem(toBeUpdated, where);
      }

      const total_cost = totalCostofPO,
        buyerId = userId;

      let newPurchaseOrder = await PurchaseOrder.createPurchaseOrder({
        total_cost,
        user_id: buyerId,
      });

      const poId = newPurchaseOrder.id;
      const createdPurchaseOrderLineItem = [];

      const createdLineItem =
        await PurchaseOrderLineItem.createPurchaseOrderLineitem({
          line_item_cost: lineItem.totalCost,
          po_id: poId,
          quantity: lineItem.quantity,
          item_id: lineItem.itemId,
        });

      createdPurchaseOrderLineItem.push(createdLineItem);

      newPurchaseOrder.purchaseOrderLineItem = createdPurchaseOrderLineItem;

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
};
