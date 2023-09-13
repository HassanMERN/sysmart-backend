const {
  sendErrorResponse,
  sendSuccessResponse,
} = require("../utils/sendResponse");
const DBInitializer = require("../../db/connection");
const StoreModel = require("../services/store/store.model");
const UserModel = require("../services/users/users.model");

module.exports = {
  async getStoreById(req, res) {
    try {
      let db = await DBInitializer();
      const Store = new StoreModel(db.models.Store);
      let store = await Store.getStoreById(req.params.id);
      if (!store) {
        return sendErrorResponse(res, 422, "Requested Store Does Not Exist");
      }
      return sendSuccessResponse(res, 201, store, "Store by specified id");
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

  async getStores(req, res) {
    try {
      let db = await DBInitializer();
      const Store = new StoreModel(db.models.Store);
      let stores = await Store.getStores();
      if (!stores) {
        return sendErrorResponse(res, 422, "Requested Store Does Not Exist");
      }
      return sendSuccessResponse(res, 201, stores, "Store list");
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

  async createStore(req, res) {
    try {
      let db = await DBInitializer();
      const Store = new StoreModel(db.models.Store);

      const { title } = req.body;
      const userId = req.user.user_id;
      let where = { userId };
      let store = await Store.getStore(where);
      if (store) {
        return sendErrorResponse(res, 422, "User already has a store");
      }
      where = { title };
      store = await Store.getStore(where);
      if (store) {
        return sendErrorResponse(res, 422, "this store title already exist");
      }
      let newStore = await Store.createStore({
        title,
        userId,
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
      const Store = new StoreModel(db.models.Store);
      const user_id = req.user.user_id;
      console.log("ID: ", user_id);
      const where = { user_id };
      const allStoresOfUser = await Store.getStore(where);
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
