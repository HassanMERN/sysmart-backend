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

  async getStoreItems(
    where = null,
    attributes = null,
    limit = null,
    offset = null,
    include = null,
    order = null
  ) {
    return this.model.findAll({
      where,
      attributes,
      limit,
      offset,
      include,
      order,
      distinct: true,
    });
  }

  async createStoreItem(storeItem) {
    const newStoreItem = await this.model.create(storeItem);
    return newStoreItem;
  }

  async updateStoreItem(update, where) {
    return this.model.update(update, { where, returning: true });
  }

  async deleteStoreItem(where) {
    return this.model.destroy({ where });
  }
};
