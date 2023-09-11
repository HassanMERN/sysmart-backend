module.exports = function (sequelize, Model, DataTypes) {
  class User extends Model {}
  User.init(
    {
      first_name: {
        type: DataTypes.STRING,
      },
      last_name: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
      },
      password_hash: {
        type: DataTypes.STRING,
      },
      recovery_code: {
        type: DataTypes.INTEGER,
      },
    },
    { sequelize, modelName: "User", tableName: "user" }
  );

  User.associate = (models) => {
    User.belongsToMany(models.Role, {
      through: "UserRole",
      as: "roles",
      foreignKey: "userId",
    });
    User.hasOne(models.Store, {
      as: "store",
      foreignKey: "userId",
    });
    User.hasMany(models.PurchaseOrder, {
      as: "purchase-orders",
      foreignKey: "purchaseOrderId",
    });
  };

  return User;
};
