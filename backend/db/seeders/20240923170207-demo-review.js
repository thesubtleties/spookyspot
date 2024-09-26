"use strict";

const { Review, User, Spot } = require("../models");
const { Op } = require("sequelize");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; 
}

module.exports = {
  async up(queryInterface, Sequelize) {
    const demoUsers = await User.findAll({
      where: {
        username: {
          [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2']
        }
      },
      attributes: ['id', 'username']
    });

    const demoSpots = await Spot.findAll({
      where: {
        name: {
          [Op.in]: ['Cozy SF Apartment', 'Manhattan Loft', 'Hollywood Hills Villa', 'Beachfront Condo', 'Rocky Mountain Retreat', 'Luxury Lakeshore Apartment']
        }
      },
      attributes: ['id', 'name']
    });

    await Review.bulkCreate(
      [
        {
          spotId: demoSpots.find((spot) => spot.name === "Cozy SF Apartment").id,
          userId: demoUsers.find((user) => user.username === "FakeUser1").id,
          review: "Great location with stunning views. The amenities were top-notch.",
          stars: 5,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Manhattan Loft").id,
          userId: demoUsers.find((user) => user.username === "Demo-lition").id,
          review: "Stylish and comfortable. Perfect for a city getaway.",
          stars: 4,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Hollywood Hills Villa").id,
          userId: demoUsers.find((user) => user.username === "FakeUser2").id,
          review: "Luxurious and spacious. The view of LA was breathtaking.",
          stars: 5,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Beachfront Condo").id,
          userId: demoUsers.find((user) => user.username === "FakeUser1").id,
          review: "Relaxing beach vacation. The sound of waves was soothing.",
          stars: 4,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Rocky Mountain Retreat").id,
          userId: demoUsers.find((user) => user.username === "Demo-lition").id,
          review: "A perfect escape into nature. Hiking trails were amazing.",
          stars: 5,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Luxury Lakeshore Apartment").id,
          userId: demoUsers.find((user) => user.username === "FakeUser2").id,
          review: "Serene lakeside stay. The apartment was well-equipped and comfortable.",
          stars: 4,
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Reviews";
    await queryInterface.bulkDelete(options, null, {});
  },
};
