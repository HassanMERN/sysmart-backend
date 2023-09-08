module.exports = class StoreModel {
  constructor(model) {
    this.model = model;
  }

  async getStoreById(id) {
    return this.model.findByPk(id);
  }

  async getStore(where, attributes = null, include = []) {
    const store = await this.model.findOne({ where, attributes, include });
    return store;
  }

  async createStore(store) {
    const newStore = await this.model.create(store);
    return newStore;
  }

  async updateStore(update, where) {
    return this.model.update(update, { where, returning: true });
  }

  async getSingleStore(where, include) {
    return this.model.findOne({
      where,
      include,
    });
  }

  async deleteStore(where) {
    return this.model.destroy({ where });
  }
};
