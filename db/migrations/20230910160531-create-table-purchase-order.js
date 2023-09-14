module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("purchase-order", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      item_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      item_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      total_cost: {
        allowNull: false,
        type: Sequelize.FLOAT,
      },

      quantity: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      store_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      user_id: {
        //this is the foreign key from model user in model purchase-orders
        type: Sequelize.INTEGER,
        references: {
          model: "user",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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
    await queryInterface.dropTable("purchase-order");
  },
};
