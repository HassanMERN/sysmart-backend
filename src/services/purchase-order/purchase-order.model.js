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

    // Create a map to store purchase orders and their line items
    const purchaseOrdersMap = new Map();

    for (const row of result.rows) {
      const poId = row.id;

      // If the purchase order doesn't exist in the map, create it
      if (!purchaseOrdersMap.has(poId)) {
        purchaseOrdersMap.set(poId, {
          purchaseOrder: {
            id: row.id,
            total_cost: row.total_cost,
            user_id: row.user_id,
            created_at: row.created_at,
            updated_at: row.updated_at,
            purchaseOrderLineItems: [], // Initialize an empty array for line items
          },
        });
      }

      // Create a line item object and add it to the purchase order's line items
      const lineItem = {
        item_id: row.item_id,
        quantity: row.quantity,
        line_item_cost: row.line_item_cost,
      };

      purchaseOrdersMap
        .get(poId)
        .purchaseOrder.purchaseOrderLineItems.push(lineItem);
    }

    // Convert the map values (purchase orders) into an array
    const purchaseOrders = Array.from(purchaseOrdersMap.values());

    const finalResponse = {
      status: "success",
      data: purchaseOrders,
    };

    return finalResponse;
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
