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
          permission_id: 7,
        },
        {
          role_id: 1,
          permission_id: 8,
        },
        {
          role_id: 1,
          permission_id: 9,
        },
        {
          role_id: 1,
          permission_id: 10,
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("role-permission", null, {});
  },
};
