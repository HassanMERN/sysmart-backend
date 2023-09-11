module.exports = class PurchaseOrderModel {
  constructor(model) {
    this.model = model;
  }

  async getPurchaseOrderById(id, attributes = null, include = []) {
    return this.model.findByPk(id, attributes, include);
  }

  async getPurchaseOrder(where, attributes = null, include = []) {
    const purchaseOrder = await this.model.findOne({
      where,
      attributes,
      include,
    });
    return purchaseOrder;
  }

  async getPurchaseOrders(
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

  async createPurchaseOrder(purchaseOrder) {
    const newPurchaseOrder = await this.model.create(purchaseOrder);
    return newPurchaseOrder;
  }
};
