const UserInitiater = require("./user.model");
const RoleInitiater = require("./roles.model");
const PermissionInitiater = require("./permissions.model");
const UserRolesInitiater = require("./users-roles.model");
const RolePermissionsInitiater = require("./role-permissions.model");
const StoreInitiater = require("./store.model");
const StoreItemInitiater = require('./store-item.model')

module.exports = async function (sequelize, Model, DataTypes) {
  return {
    User: UserInitiater(sequelize, Model, DataTypes),
    Role: RoleInitiater(sequelize, Model, DataTypes),
    Permission: PermissionInitiater(sequelize, Model, DataTypes),
    UserRole: UserRolesInitiater(sequelize, Model, DataTypes),
    RolePermission: RolePermissionsInitiater(sequelize, Model, DataTypes),
    Store: StoreInitiater(sequelize, Model, DataTypes),
    StoreItem: StoreItemInitiater(sequelize, Model, DataTypes),
  };
};
