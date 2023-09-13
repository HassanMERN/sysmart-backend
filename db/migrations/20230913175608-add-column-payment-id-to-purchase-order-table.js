"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("purchase-order", "payment_id", {
      type: Sequelize.TEXT,
      allowNull: true, // You can change this to false if payment_id is required
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("purchase-order", "payment_id");
  },
};
