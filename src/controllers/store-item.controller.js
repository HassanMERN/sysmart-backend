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
      const StoreItem = new StoreItemModel(db.models.StoreItem);
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
      const StoreItem = new StoreItemModel(db.models.StoreItem);

      const { title, quantity, unit_cost } = req.body;
      let where = { title };
      let storeItem = await StoreItem.getStoreItem(where);
      if (storeItem) {
        return sendErrorResponse(
          res,
          422,
          "this store item title already exist"
        );
      }
      let newStoreItem = await Store.createStoreItem({
        title,
        userId: req.user.user_id, //start workin here
      });
      return sendSuccessResponse(
        res,
        201,
        newStore.dataValues,
        "Store created successfully"
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

  async getUserStores(req, res) {
    try {
      let db = await DBInitializer();
      const User = new UserModel(db.models.User);
      const include = [
        {
          model: db.models.Store,
          as: "stores",
        },
      ];
      const allStoresOfUser = await User.getSingleUser(
        { id: req.user.user_id },
        include
      );
      return sendSuccessResponse(
        res,
        201,
        allStoresOfUser,
        "Store list of a user"
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

  async updateStorebyId(req, res) {
    try {
      let db = await DBInitializer();
      const Store = new StoreModel(db.models.Store);
      const { title } = req.body;
      const { id } = req.params;
      let where = {
        id,
      };
      let store = await Store.getStore(where);
      if (!store) {
        return sendErrorResponse(res, 422, "Requested Store Does Not Exist");
      }
      const toBeUpdated = {
        title,
      };
      const updatedStore = await Store.updateStore(toBeUpdated, where);
      return sendSuccessResponse(
        res,
        201,
        updatedStore[1],
        "Store Updated Successfully!"
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

  async deleteStore(req, res) {
    try {
      let db = await DBInitializer();
      const Store = new StoreModel(db.models.Store);
      const existedStore = await Store.getStoreById(req.params.id);
      if (!existedStore) {
        return sendErrorResponse(res, 422, "Store does not exist");
      }
      const deletedStore = await existedStore.destroy();
      return sendSuccessResponse(
        res,
        201,
        deletedStore,
        `Store with ID: ${existedStore.id} Deleted Successfully`
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
