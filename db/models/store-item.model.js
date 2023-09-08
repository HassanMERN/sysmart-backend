module.exports = function (sequelize, Model, DataTypes) {
  class StoreItems extends Model {}
  StoreItems.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
      },
      quantity: {
        type: DataTypes.INTEGER,
      },
      unit_cost: {
        type: DataTypes.FLOAT,
      },
    },
    { sequelize, modelName: "StoreItems", tableName: "store-items" }
  );

  StoreItems.associate = (models) => {
    Store.belongsTo(models.Store, {
      as: "store",
      foreignKey: "storeId",
    });
  };

  return StoreItems;
};
