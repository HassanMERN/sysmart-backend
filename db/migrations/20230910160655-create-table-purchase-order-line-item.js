module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("purchase-order-line-item", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      item_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "store-item",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      po_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "purchase-order",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      quantity: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      line_item_cost: {
        allowNull: false,
        type: Sequelize.FLOAT,
      },
      created_at: {
        type: "TIMESTAMP",
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
      },
      updated_at: {
        type: "TIMESTAMP",
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("purchase-order-line-item");
  },
};
