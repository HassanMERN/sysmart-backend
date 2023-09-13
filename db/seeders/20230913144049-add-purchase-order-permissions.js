"use strict";
const Constants = require("../../src/utils/constants");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "permission",
      [
        { name: Constants.PERMISSION_CREATE_A_PURCHASE_ORDER },
        { name: Constants.PERMISSION_VIEW_A_PURCHASE_ORDER },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("permission", null, {});
  },
};
