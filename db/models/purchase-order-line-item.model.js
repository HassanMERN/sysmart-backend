module.exports = function (sequelize, Model, DataTypes) {
  class PurchaseOrderLineItem extends Model {}
  PurchaseOrderLineItem.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
      },
      line_item_cost: {
        type: DataTypes.FLOAT,
      },
    },
    {
      sequelize,
      modelName: "PurchaseOrderLineItem",
      tableName: "purchase-order",
    }
  );

  PurchaseOrderLineItem.associate = (models) => {
    PurchaseOrderLineItem.belongsTo(models.PurchaseOrder, {
      as: "purchase-order-line-item",
      foreignKey: "purchaseOrderlineItemId",
    });

    PurchaseOrderLineItem.belongsTo(models.StoreItems, {
      foreignKey: "storeItemId",
    });
  };

  return PurchaseOrderLineItem;
};
