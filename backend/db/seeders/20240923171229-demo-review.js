"use strict";

const { Review } = require("../models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    const demoUsers = await queryInterface.sequelize.query(
      `SELECT id, username FROM Users WHERE username IN ('Demo-lition', 'FakeUser1', 'FakeUser2');`
    );
    const userRows = demoUsers[0];

    const demoSpots = await queryInterface.sequelize.query(
      `SELECT id, name FROM Spots WHERE name IN ('Cozy SF Apartment','Manhattan Loft', 'Hollywood Hills Villa', 'Beachfront Condo', 'Rocky Mountain Retreat', 'Luxury Lakeshore Apartment')`
    );
    const spotRows = demoSpots[0];

    await Review.bulkCreate(
      [
        {
          spotId: spotRows.find((spot) => spot.name === "Cozy SF Apartment").id,
          userId: userRows.find((user) => user.username === "FakeUser1").id,
          review:
            "Great location with stunning views. The amenities were top-notch.",
          stars: 5,
        },
        {
          spotId: spotRows.find((spot) => spot.name === "Beachfront Condo").id,
          userId: userRows.find((user) => user.username === "Demo-lition").id,
          review:
            "Cozy place but could use some updates. The host was very friendly.",
          stars: 4,
        },
        {
          spotId: spotRows.find(
            (spot) => spot.name === "Luxury Lakeshore Apartment"
          ).id,
          userId: userRows.find((user) => user.username === "FakeUser1").id,
          review:
            "Disappointing experience. The place wasn't as clean as expected.",
          stars: 2,
        },
        {
          spotId: spotRows.find((spot) => spot.name === "Hollywood Hills Villa")
            .id,
          userId: userRows.find((user) => user.username === "FakeUser2").id,
          review: "Absolutely loved it! Will definitely come back.",
          stars: 5,
        },
        {
          spotId: spotRows.find((spot) => spot.name === "Cozy SF Apartment").id,
          userId: userRows.find((user) => user.username === "FakeUser2").id,
          review: "Good value for money. Location was convenient.",
          stars: 4,
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Demos", null, {});
  },
};
