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
          permission_id: 1,
        },
        {
          role_id: 1,
          permission_id: 2,
        },
        {
          role_id: 1,
          permission_id: 3,
        },
        {
          role_id: 1,
          permission_id: 4,
        },
        {
          role_id: 1,
          permission_id: 5,
        },
        {
          role_id: 1,
          permission_id: 6,
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("role-permission", null, {});
  },
};
