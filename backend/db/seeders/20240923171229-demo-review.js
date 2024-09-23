"use strict";

const review = require("../models/review");

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
      `SELECT id, name FROM Spots WHERE name IN ('Cozy SF Apartment','Manhattan Loft', 'Hollywood Hills Villa', 'Beachfront Condo', 'Rocky Mountain Retreat')`
    )

    await review.bulkCreate([
      {
        spotId: ,
        userId: userRows.find((user) => user.username === "Demo-lition").id,
        review:
          "Great location with stunning views. The amenities were top-notch.",
        stars: 5,
      },
      {
        spotId: 2,
        userId: 1,
        review:
          "Cozy place but could use some updates. The host was very friendly.",
        stars: 4,
      },
      {
        spotId: 3,
        userId: 3,
        review:
          "Disappointing experience. The place wasn't as clean as expected.",
        stars: 2,
      },
      {
        spotId: 1,
        userId: 3,
        review: "Absolutely loved it! Will definitely come back.",
        stars: 5,
      },
      {
        spotId: 2,
        userId: 2,
        review: "Good value for money. Location was convenient.",
        stars: 4,
      },
    ]);
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
