module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("purchase-order", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      total_cost: {
        allowNull: false,
        type: Sequelize.FLOAT,
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
