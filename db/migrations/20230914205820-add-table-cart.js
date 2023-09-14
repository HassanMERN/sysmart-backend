module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("cart", {
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
      quantity: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "user",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      store_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
    await queryInterface.dropTable("cart");
  },
};
