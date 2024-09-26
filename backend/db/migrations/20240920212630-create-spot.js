"use strict";
/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "Spots",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        ownerId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "Users",
            schema: process.env.SCHEMA
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        address: {
          type: Sequelize.TEXT,
          allowNull: false,
          unique: true,
        },
        city: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        state: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        country: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        lat: {
          type: Sequelize.DECIMAL(10, 4),
          allowNull: false,
        },
        lng: {
          type: Sequelize.DECIMAL(10, 4),
          allowNull: false,
        },
        name: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        price: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
      },
      options
    );
  },
  async down(queryInterface, Sequelize) {
    options.tableName = "Spots";
    return queryInterface.dropTable(options);
  },
};
