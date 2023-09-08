module.exports = function (sequelize, Model, DataTypes) {
  class Store extends Model {}
  Store.init(
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
    },
    { sequelize, modelName: "Store", tableName: "store" }
  );

  Store.associate = (models) => {
    Store.belongsTo(models.User, {
      as: "user",
      foreignKey: "userId",
    });
  };

  return Store;
};
