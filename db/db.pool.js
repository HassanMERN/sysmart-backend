const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.BACKEND_DB_USERNAME,
  host: process.env.BACKEND_DB_HOST,
  database: process.env.BACKEND_DB_NAME,
  password: process.env.BACKEND_DB_PASSWORD,
  port: 5432,
});

module.exports = pool;
