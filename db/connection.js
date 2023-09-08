const { Sequelize, Model, DataTypes, Association } = require("sequelize");
require("dotenv").config();
const ModelInitiater = require("./models/models.index");

const dbName = process.env.BACKEND_DB_NAME;
const dbHost = process.env.BACKEND_DB_HOST;
const dbUsername = process.env.BACKEND_DB_USERNAME;
const dbPassword = process.env.BACKEND_DB_PASSWORD;

const sequelize = new Sequelize(dbName, dbUsername, dbPassword, {
  host: dbHost,
  dialect: "postgres",
  define: {
    underscored: true,
  },
});

async function db_initialize() {
  try {
    await sequelize.authenticate().then(() => {
      console.log(
        "Connection has been established successfully with >>> ",
        dbName,
        " at >>> ",
        dbHost
      );
    });

    await ModelInitiater(sequelize, Model, DataTypes);
    const models = sequelize.models;
    Object.keys(models).forEach((key) => {
      if ("associate" in models[key]) {
        models[key].associate(models);
      }
    });

    return sequelize;
  } catch (error) {
    console.error("Error in Database", error);
    throw error;
  }
}

module.exports = db_initialize;
