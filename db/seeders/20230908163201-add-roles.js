"use strict";
const Constants = require("../../src/utils/constants");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "role",
      [{ name: Constants.ROLE_ADMIN }, { name: Constants.ROLE_USER }],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("role", null, {});
  },
};
