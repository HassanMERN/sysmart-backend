const {
  sendErrorResponse,
  sendSuccessResponse,
} = require("../utils/sendResponse");
const DBInitializer = require("../../db/connection");
const StoreItemModel = require("../services/store-items/store-item.model");
const StoreModel = require("../services/store/store.model");
const UserModel = require("../services/users/users.model");

module.exports = {
  async getStoreItemById(req, res) {
    try {
      let db = await DBInitializer();
      const StoreItem = new StoreItemModel(db.models.StoreItems);
      let storeItem = await StoreItem.getStoreById(req.params.id);
      if (!storeItem) {
        return sendErrorResponse(
          res,
          422,
          "Requested Store Item Does Not Exist"
        );
      }
      return sendSuccessResponse(
        res,
        201,
        storeItem,
        "Store Item by specified id"
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

  async createStoreItem(req, res) {
    try {
      let db = await DBInitializer();
      const StoreItem = new StoreItemModel(db.models.StoreItems);
      const Store = new StoreModel(db.models.Store);
      const { title, quantity, unit_cost } = req.body;
      const userId = req.user.user_id;
      let where = { user_id: userId };
      const store = await Store.getStore(where);
      const storeId = store.id;
      if (!storeId) {
        return sendErrorResponse(res, 422, "Store does not exist");
      }
      where = { title: title };

      let storeItem = await StoreItem.getStoreItem(where);
      if (storeItem) {
        return sendErrorResponse(
          res,
          422,
          "this store item title already exist"
        );
      }
      let newStoreItem = await StoreItem.createStoreItem({
        title,
        quantity,
        unit_cost,
        store_id: storeId,
      });
      return sendSuccessResponse(
        res,
        201,
        newStoreItem.dataValues,
        "Store Item created successfully"
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

  async getStoreItems(req, res) {
    try {
      let db = await DBInitializer();
      const StoreItem = new StoreItemModel(db.models.StoreItems);
      const storeId = req.params;
      const include = [
        {
          model: db.models.Store,
          as: "store",
        },
      ];
      const where = { storeId };
      const allItemsOfStore = await StoreItem.getStoreItems(where, include);
      return sendSuccessResponse(
        res,
        201,
        allItemsOfStore,
        "Item list of a store"
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

  async updateStoreItembyId(req, res) {
    try {
      let db = await DBInitializer();
      const StoreItem = new StoreItemModel(db.models.StoreItems);
      const { title, quantity, unit_cost } = req.body;
      const { id } = req.params;
      let where = {
        id,
      };
      let storeItem = await StoreItem.getStoreItem(where);
      if (!storeItem) {
        return sendErrorResponse(
          res,
          422,
          "Requested Store Item Does Not Exist"
        );
      }
      const toBeUpdated = {
        title,
        quantity,
        unit_cost,
      };
      const updatedStoreItem = await StoreItem.updateStoreItem(
        toBeUpdated,
        where
      );
      return sendSuccessResponse(
        res,
        201,
        updatedStoreItem[1],
        "Store Item Updated Successfully!"
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

  async deleteStoreItem(req, res) {
    try {
      let db = await DBInitializer();
      const StoreItem = new StoreItemModel(db.models.StoreItems);
      const existedStoreItem = await StoreItem.getStoreItemById(req.params.id);
      if (!existedStoreItem) {
        return sendErrorResponse(res, 422, "StoreItem does not exist");
      }
      const deletedStoreItem = await existedStoreItem.destroy();
      return sendSuccessResponse(
        res,
        201,
        deletedStoreItem,
        `StoreItem with ID: ${existedStoreItem.id} Deleted Successfully`
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