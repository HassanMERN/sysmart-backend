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
      const include = [
        {
          model: db.models.PurchaseOrderLineItem,
          as: "purchase-order-line-item",
        },
      ];
      let purchaseOrder = await PurchaseOrder.getPurchaseOrderById(
        req.params.id,
        include
      );
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
      const PurchaseOrder = new PurchaseOrderModel(db.models.PurchaseOrders);
      const PurchaseOrderLineItem = new PurchaseOrderLineItemModel(
        db.models.PurchaseOrderLineItems
      );
      const StoreItem = new StoreItemModel(db.models.StoreItem);
      const { title, quantity, unit_cost } = req.body;
      const userId = req.user.user_id;
      let totalCostofPO = 0;
      console.log(req.body);

      for (const lineItem of req.body.lineItems) {
        let storeItem = await StoreItem.getStoreItemById(lineItem.id);
        if (!storeItem) {
          return sendErrorResponse(res, 422, "Wrong Store Item Specified");
        } else if (storeItem.quantity < lineItem.quantity) {
          return sendErrorResponse(
            res,
            422,
            `Not enough stock available for store item: ${storeItem.title} \n max available: ${storeItem.quantity}`
          );
        } else {
          lineItem.totalCost = lineItem.quantity * storeItem.unit_cost;
          lineItem.itemId = storeItem.id;
          totalCostofPO += lineItem.totalCost;
        }
      }

      let newPurchaseOrder = await PurchaseOrder.createPurchaseOrder({
        total_cost: totalCostofPO,
        buyer_id: req.user.id,
      });
      console.log("PO CREATED>>>>>>>>>>>>", newPurchaseOrder);

      const poId = newPurchaseOrder.dataValues.id;
      for (const lineItem in req.body.lineItems) {
        let newPurchaseOrderLineItem =
          await PurchaseOrderLineItem.createPurchaseOrderLineitem({
            line_item_cost: lineItem.totalCost,
            po_id: poId,
            quantity: lineItem.quantity,
            item_id: lineItem.itemId,
          });
        console.log("LINE ITEM CREATED>>>>>>>>", newPurchaseOrderLineItem);

        newPurchaseOrder.purchaseOrderLineItems.push(newPurchaseOrderLineItem);
      }
      console.log("FINAL PO>>>>>>>>>>", newPurchaseOrder);
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

  async getPurchaseOrders(req, res) {
    try {
      let db = await DBInitializer();
      const PurchaseOrder = new PurchaseOrderModel(db.models.PurchaseOrder);
      const userId = req.user.user_id;
      const include = [
        {
          model: db.models.PurchaseOrderLineItem,
          as: "purchase-order-line-item",
        },
      ];
      const where = { buyer_id: userId };
      const allPurchaseOrders = await PurchaseOrder.getPurchaseOrders(
        where,
        include
      );
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
      const userId = req.params;
      const include = [
        {
          model: db.models.PurchaseOrderLineItem,
          as: "purchase-order-line-item",
        },
      ];
      const where = { buyer_id: userId };
      const allPurchaseOrders = await PurchaseOrder.getPurchaseOrders(
        where,
        include
      );
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
