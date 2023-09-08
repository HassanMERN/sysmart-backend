module.exports = function (sequelize, Model, DataTypes) {

  class Role extends Model {}
  Role.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: "Role",
      tableName: "role"
    }
  );

  Role.associate = (models) => {
    Role.belongsToMany(models.User, {
      through: "UserRole",
      as: "users",
      foreignKey: "roleId",
    });
    Role.belongsToMany(models.Permission, {
      through: "RolePermission",
      as: "permissions",
      foreignKey: "roleId",
    });
  };

  return Role;
};
