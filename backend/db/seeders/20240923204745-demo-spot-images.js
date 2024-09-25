"use strict";

const { SpotImage } = require("../models");

module.exports = {
  async up(queryInterface, Sequelize) {
    const demoSpots = await queryInterface.sequelize.query(
      `SELECT id, name FROM Spots WHERE name IN ('Cozy SF Apartment', 'Manhattan Loft', 'Hollywood Hills Villa');`
    );

    const spotRows = demoSpots[0];

    if (spotRows.length === 0) {
      console.error("No spots found. Ensure the spots exist in the database.");
      return;
    }

    await SpotImage.bulkCreate(
      [
        {
          spotId: spotRows.find((spot) => spot.name === "Cozy SF Apartment").id,
          url: "https://example.com/image1.jpg",
          preview: true,
        },
        {
          spotId: spotRows.find((spot) => spot.name === "Manhattan Loft").id,
          url: "https://example.com/image2.jpg",
          preview: true,
        },
        {
          spotId: spotRows.find((spot) => spot.name === "Hollywood Hills Villa")
            .id,
          url: "https://example.com/image3.jpg",
          preview: true,
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("spot_images", null, {});
  },
};
