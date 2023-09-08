module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("user-role", {
      user_id: {
        //this is the foreign key from model user in model contact
        type: Sequelize.INTEGER,
        references: {
          model: "user",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      role_id: {
        //this is the foreign key from model role in model contact
        type: Sequelize.INTEGER,
        references: {
          model: "role",
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

  down: (queryInterface, Sequelize) => {
    // remove table
    return queryInterface.dropTable("user-role");
  },
};
