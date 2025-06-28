"use strict";

const { Spot, User, Booking } = require("../models");
const { Op } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const spots = await Spot.findAll({
      where: {
        name: {
          [Op.in]: [
            "Whisper Manor",
            "Crypt Cavern Inn",
            "Banshee's Bungalow",
            "Phantom Lighthouse",
            "Witch's Treehouse",
          ],
        },
      },
      attributes: ["id", "name"],
    });

    const users = await User.findAll({
      where: {
        username: {
          [Op.in]: ["Demo-lition", "FakeUser1", "FakeUser2"],
        },
      },
      attributes: ["id", "username"],
    });

    await Booking.bulkCreate(
      [
        {
          spotId: spots.find((spot) => spot.name === "Whisper Manor").id,
          userId: users.find((user) => user.username === "Demo-lition").id,
          startDate: "2023-10-28",
          endDate: "2023-10-31",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          spotId: spots.find((spot) => spot.name === "Crypt Cavern Inn").id,
          userId: users.find((user) => user.username === "FakeUser1").id,
          startDate: "2023-11-01",
          endDate: "2023-11-03",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          spotId: spots.find((spot) => spot.name === "Banshee's Bungalow").id,
          userId: users.find((user) => user.username === "FakeUser2").id,
          startDate: "2023-12-24",
          endDate: "2023-12-26",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          spotId: spots.find((spot) => spot.name === "Phantom Lighthouse").id,
          userId: users.find((user) => user.username === "Demo-lition").id,
          startDate: "2024-01-15",
          endDate: "2024-01-18",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          spotId: spots.find((spot) => spot.name === "Witch's Treehouse").id,
          userId: users.find((user) => user.username === "FakeUser1").id,
          startDate: "2024-04-30",
          endDate: "2024-05-02",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { validate: true }
    );
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = "Bookings";
    return queryInterface.bulkDelete(options, null, {});
  },
};
