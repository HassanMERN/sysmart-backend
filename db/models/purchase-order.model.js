module.exports = function (sequelize, Model, DataTypes) {
  class PurchaseOrder extends Model {}
  PurchaseOrder.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      item_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      item_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      total_cost: {
        type: DataTypes.FLOAT,
      },
      store_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "PurchaseOrder",
      tableName: "purchase-order",
    }
  );

  PurchaseOrder.associate = (models) => {
    PurchaseOrder.belongsTo(models.User, {
      as: "user",
      foreignKey: "userId",
    });
  };

  return PurchaseOrder;
};
