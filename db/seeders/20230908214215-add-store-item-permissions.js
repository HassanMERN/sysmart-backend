"use strict";
const Constants = require("../../src/utils/constants");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "permission",
      [
        { name: Constants.PERMISSION_CREATE_A_STORE_ITEM },
        { name: Constants.PERMISSION_DELETE_A_STORE_ITEM },
        { name: Constants.PERMISSION_UPDATE_A_STORE_ITEM },
        { name: Constants.PERMISSION_VIEW_A_STORE_ITEM },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("permission", null, {});
  },
};
