module.exports = function (sequelize, Model, DataTypes) {
  class UserRole extends Model {}
  UserRole.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "User",
          key: "id",
        },
      },
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Role",
          key: "id",
        },
      },
    },
    { sequelize, modelName: "UserRole", tableName: "user-role" }
  );

  return UserRole;
};
