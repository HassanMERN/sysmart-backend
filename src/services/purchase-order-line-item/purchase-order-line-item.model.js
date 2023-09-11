module.exports = class PurchaseOrderLineitemModel {
  constructor(model) {
    this.model = model;
  }

  async getPurchaseOrderLineitemById(id) {
    return this.model.findByPk(id);
  }

  async getPurchaseOrderLineitem(where, attributes = null, include = []) {
    const purchaseOrderLineitem = await this.model.findOne({
      where,
      attributes,
      include,
    });
    return purchaseOrderLineitem;
  }

  async getPurchaseOrderLineitems(
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

  async createPurchaseOrderLineitem(purchaseOrderLineitem) {
    const newPurchaseOrderLineitem = await this.model.create(
      purchaseOrderLineitem
    );
    return newPurchaseOrderLineitem;
  }
};
