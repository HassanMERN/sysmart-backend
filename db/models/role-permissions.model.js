module.exports = function (sequelize, Model, DataTypes) {
  /**
   * RolePermissions Model Class.
   * @class RolePermissions @extend Model
   */
    class RolePermission extends Model {}
    RolePermission.init(
      {
        roleId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'Role',
            key: 'id',
          },
        },
        permissionId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'Permission',
            key: 'id',
          },
        },
      },
      { sequelize, modelName: 'RolePermission', tableName: "role-permission" }
    );
  
    return RolePermission;
  };
  