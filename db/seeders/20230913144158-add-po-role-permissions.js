"use strict";
const Constants = require("../../src/utils/constants");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "role-permission",
      [
        //Admin Role-Permissions
        {
          role_id: 1,
          permission_id: 15,
        },
        {
          role_id: 1,
          permission_id: 16,
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("role-permission", null, {});
  },
};
