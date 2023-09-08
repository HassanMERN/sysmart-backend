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
          permission_id: 11,
        },
        {
          role_id: 1,
          permission_id: 12,
        },
        {
          role_id: 1,
          permission_id: 13,
        },
        {
          role_id: 1,
          permission_id: 14,
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("role-permission", null, {});
  },
};
