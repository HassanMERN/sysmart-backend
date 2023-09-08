module.exports = class StoreItemModel {
  constructor(model) {
    this.model = model;
  }

  async getStoreItemById(id) {
    return this.model.findByPk(id);
  }

  async getStoreItem(where, attributes = null, include = []) {
    const storeItem = await this.model.findOne({ where, attributes, include });
    return storeItem;
  }

  async createStoreItem(storeItem) {
    const newStoreItem = await this.model.create(storeItem);
    return newStoreItem;
  }

  async updateStoreItem(update, where) {
    return this.model.update(update, { where, returning: true });
  }

  async getSingleStoreItem(where, include) {
    return this.model.findOne({
      where,
      include,
    });
  }

  async deleteStoreItem(where) {
    return this.model.destroy({ where });
  }
};
