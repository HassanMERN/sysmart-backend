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
      total_cost: {
        type: DataTypes.FLOAT,
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
    PurchaseOrder.belongsToMany(models.PurchaseOrderLineItem, {
      through: "PurchaseOrderLineItem",
      as: "purchase-order-line-item",
      foreignKey: "poId",
    });
  };

  return PurchaseOrder;
};
