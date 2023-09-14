const pool = require("../../../db/db.pool");

module.exports = class CartModel {
  constructor(model) {
    this.model = model;
  }

  async createCartItem(purchaseOrder) {
    const { user_id, id, item_name, quantity, store_id } = purchaseOrder;
    const created_at = new Date(),
      updated_at = new Date();

    const query = {
      text: 'INSERT INTO "cart" ("item_id",  "item_name",  "quantity","user_id", "store_id","created_at", "updated_at") VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING "id",  "item_id",  "item_name",  "quantity", "user_id", "store_id" "created_at", "updated_at"',
      values: [
        id,
        item_name,
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

  async getCartItems(userId) {
    const query = {
      text: 'SELECT * FROM "cart" WHERE "user_id" = $1',
      values: [userId],
    };

    const result = await pool.query(query);
    const cartItems = result.rows;

    return cartItems;
  }

  async getCartItemById(id) {
    const query = {
      text: 'SELECT * FROM "cart" WHERE "id" = $1',
      values: [id],
    };

    const result = await pool.query(query);
    const cartItems = result.rows[0];

    return cartItems;
  }

  async deleteCartItem(id) {
    const query = {
      text: 'DELETE from cart WHERE "id" = $1',
      values: [id],
    };
    const result = await pool.query(query);
    return true;
  }
};
