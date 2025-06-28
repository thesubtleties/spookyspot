const config = require("./index");

module.exports = {
  development: {
    storage: config.dbFile,
    dialect: "sqlite",
    seederStorage: "sequelize",
    logQueryParameters: true,
    typeValidation: true,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "spookyspot",
    host: process.env.DB_HOST || "spookyspot-db", // container name
    dialect: "postgres",
    seederStorage: "sequelize",
    define: {
      schema: process.env.SCHEMA,
    },
  },
};
