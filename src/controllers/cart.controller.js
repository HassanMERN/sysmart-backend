const {
  sendErrorResponse,
  sendSuccessResponse,
} = require("../utils/sendResponse");
const DBInitializer = require("../../db/connection");
const CartModel = require("../services/cart/cart.model");
const StoreItemModel = require("../services/store-items/store-item.model");
const PurchaseOrderModel = require("../services/purchase-order/purchase-order.model");
module.exports = {
  async createCartItem(req, res) {
    try {
      let db = await DBInitializer();
      const Cart = new CartModel(db.models.Cart);
      const StoreItem = new StoreItemModel(db.models.StoreItems);
      const userId = req.user.user_id;
      const { id, item_name, quantity, store_id } = req.body;

      let storeItem = await StoreItem.getStoreItemById(id);
      console.log(storeItem);
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
      }

      let newCartItem = await Cart.createCartItem({
        id,
        item_name,
        quantity,
        user_id: userId,
        store_id,
      });

      return sendSuccessResponse(
        res,
        201,
        newCartItem,
        "Cart Item Added successfully"
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

  async getMyCart(req, res) {
    try {
      let db = await DBInitializer();
      const Cart = new CartModel(db.models.Cart);
      const userId = req.user.user_id;

      const allCartItems = await Cart.getCartItems(userId);
      return sendSuccessResponse(res, 201, allCartItems, "All Purchase Orders");
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

  async deleteCartItem(req, res) {
    try {
      let db = await DBInitializer();
      const Cart = new CartModel(db.models.Cart);
      const { id } = req.params;

      const deletedCartItem = await Cart.deleteCartItem(id);
      return sendSuccessResponse(
        res,
        201,
        deletedCartItem,
        `Cart Item Deleted Successfully`
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

  async buyCartItem(req, res) {
    try {
      let db = await DBInitializer();
      const Cart = new CartModel(db.models.Cart);
      const PurchaseOrder = new PurchaseOrderModel(db.models.PurchaseOrder);
      const StoreItem = new StoreItemModel(db.models.StoreItems);
      const { id } = req.params;
      const cartItem = await Cart.getCartItemById(id);
      const { item_id, item_name, quantity, user_id, store_id } = cartItem;

      let totalCost;
      let storeItem = await StoreItem.getStoreItemById(item_id);
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
        id: item_id,
        title: item_name,
        quantity,
        total_cost: totalCost,
        user_id,
        store_id,
      });
      await Cart.deleteCartItem(id);

      return sendSuccessResponse(
        res,
        201,
        newPurchaseOrder,
        "Cart Item bought successfully"
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
