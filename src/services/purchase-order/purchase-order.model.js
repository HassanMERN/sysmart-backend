const pool = require("../../../db/db.pool");

module.exports = class PurchaseOrderModel {
  constructor(model) {
    this.model = model;
  }

  async getPurchaseOrderById(poId) {
    const poTable = '"purchase-order"';
    const query = `
      SELECT po.*
      FROM ${poTable} po
      WHERE po.id = ${poId}`;

    const result = await pool.query(query);

    if (result.rows.length === 0) {
      // Handle the case where the purchase order with the given ID does not exist
      return {
        status: "error",
        message: "Purchase Order not found",
      };
    }

    const purchaseOrder = {
      id: result.rows[0].id,
      total_cost: result.rows[0].total_cost,
      user_id: result.rows[0].user_id,
      created_at: result.rows[0].created_at,
      updated_at: result.rows[0].updated_at,
    };

    return purchaseOrder;
  }

  async getPurchaseOrders(userId) {
    const poTable = '"purchase-order"';
    const pliTable = '"purchase-order-line-item"';
    const query = `
      SELECT po.*, pli.*
      FROM ${poTable} po
      JOIN ${pliTable} pli ON po.id = pli.po_id
      WHERE po.user_id = ${userId}`;

    const result = await pool.query(query);

    const purchaseOrders = [];

    for (const row of result.rows) {
      const poId = row.id;

      // Find the purchase order in the array or create a new one
      let purchaseOrder = purchaseOrders.find((po) => po.id === poId);

      if (!purchaseOrder) {
        purchaseOrder = {
          id: row.id,
          total_cost: row.total_cost,
          user_id: row.user_id,
          created_at: row.created_at,
          updated_at: row.updated_at,
          purchaseOrderLineItems: [],
        };
        purchaseOrders.push(purchaseOrder);
      }

      // Create a line item object and add it to the purchase order
      const lineItem = {
        item_id: row.item_id,
        quantity: row.quantity,
        line_item_cost: row.line_item_cost,
      };

      purchaseOrder.purchaseOrderLineItems.push(lineItem);
    }

    // Flatten the result to match the desired format
    const finalResponse = purchaseOrders.map((po) => ({
      id: po.id,
      total_cost: po.total_cost,
      quantity: po.purchaseOrderLineItems[0].quantity,
      item_id: po.purchaseOrderLineItems[0].item_id,
    }));

    return { purchaseOrders: finalResponse };
  }

  async createPurchaseOrder(purchaseOrder) {
    const { total_cost, user_id } = purchaseOrder;
    const created_at = new Date(),
      updated_at = new Date();

    const query = {
      text: 'INSERT INTO "purchase-order" ("total_cost", "user_id", "created_at", "updated_at") VALUES ($1, $2, $3, $4) RETURNING "id", "total_cost", "user_id", "created_at", "updated_at"',
      values: [total_cost, user_id, created_at, updated_at],
    };

    const result = await pool.query(query);

    const newPurchaseOrder = result.rows[0];
    return newPurchaseOrder;
  }
};
