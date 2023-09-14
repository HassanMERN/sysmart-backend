const pool = require("../../../db/db.pool");

module.exports = class PurchaseOrderModel {
  constructor(model) {
    this.model = model;
  }

  async getPurchaseOrderById(poId) {
    const query = {
      text: 'SELECT * FROM "purchase-order" WHERE "id" = $1',
      values: [poId],
    };

    const result = await pool.query(query);
    const purchaseOrder = result.rows[0]; // Assuming there's only one result

    return purchaseOrder;
  }

  async getPurchaseOrders(userId) {
    const query = {
      text: 'SELECT * FROM "purchase-order" WHERE "user_id" = $1',
      values: [userId],
    };

    const result = await pool.query(query);
    const purchaseOrders = result.rows;

    return purchaseOrders;
  }

  async getPurchaseOrdersByStoreId(storeId) {
    const query = {
      text: 'SELECT * FROM "purchase-order" WHERE "store_id" = $1',
      values: [storeId],
    };

    const result = await pool.query(query);
    const purchaseOrders = result.rows;

    return purchaseOrders;
  }

  async createPurchaseOrder(purchaseOrder) {
    const { total_cost, user_id, id, title, quantity, store_id } =
      purchaseOrder;
    const created_at = new Date(),
      updated_at = new Date();

    const query = {
      text: 'INSERT INTO "purchase-order" ("total_cost", "item_id",  "item_name",  "quantity","user_id", "store_id","created_at", "updated_at") VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING "id", "total_cost",  "item_id",  "item_name",  "quantity", "user_id", "store_id" "created_at", "updated_at"',
      values: [
        total_cost,
        id,
        title,
        quantity,
        user_id,
        store_id,
        created_at,
        updated_at,
      ],
    };

    const result = await pool.query(query);

    const newPurchaseOrder = result.rows[0];
    return newPurchaseOrder;
  }
};
