"use strict";

const { SpotImage, Spot } = require("../models");
const { Op } = require("sequelize");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    const demoSpots = await Spot.findAll({
      where: {
        name: {
          [Op.in]: ['Cozy SF Apartment', 'Manhattan Loft', 'Hollywood Hills Villa']
        }
      },
      attributes: ['id', 'name']
    });
    
    if (demoSpots.length === 0) {
      console.error("No spots found. Ensure the spots exist in the database.");
      return;
    }

    await SpotImage.bulkCreate(
      [
        {
          spotId: demoSpots.find((spot) => spot.name === "Cozy SF Apartment").id,
          url: "https://example.com/sf-apartment1.jpg",
          preview: true,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Cozy SF Apartment").id,
          url: "https://example.com/sf-apartment2.jpg",
          preview: false,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Manhattan Loft").id,
          url: "https://example.com/manhattan-loft1.jpg",
          preview: true,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Manhattan Loft").id,
          url: "https://example.com/manhattan-loft2.jpg",
          preview: false,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Hollywood Hills Villa").id,
          url: "https://example.com/hollywood-villa1.jpg",
          preview: true,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Hollywood Hills Villa").id,
          url: "https://example.com/hollywood-villa2.jpg",
          preview: false,
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "SpotImages";
    await queryInterface.bulkDelete(options, null, {});
  },
};
