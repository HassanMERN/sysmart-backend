const pool = require("../../../db/db.pool");

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
    const { line_item_cost, quantity, po_id, item_id } = purchaseOrderLineitem;
    const created_at = new Date(),
      updated_at = new Date();

    const query = {
      text: 'INSERT INTO "purchase-order-line-item" ("line_item_cost", "quantity", "po_id", "item_id" ,"created_at", "updated_at") VALUES ($1, $2, $3, $4, $5, $6) RETURNING "id", "line_item_cost", "quantity", "item_id", "po_id",  "created_at", "updated_at"',
      values: [
        line_item_cost,
        quantity,
        po_id,
        item_id,
        created_at,
        updated_at,
      ],
    };

    const result = await pool.query(query);

    const newPurchaseOrderLineItem = result.rows[0];
    return newPurchaseOrderLineItem;
  }
};
