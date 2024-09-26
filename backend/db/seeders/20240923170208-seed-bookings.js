"use strict";

const { Spot, User, Bookings } = require("../models");

/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const spots = await Spot.findAll({
      where: {
        address: {
          [Op.in]: [
            "123 Maple Street",
            "456 Oak Avenue",
            "789 Pine Road",
            "101 Beach Boulevard",
            "202 Mountain View Drive",
          ],
        },
      },
      attributes: ["id", "address"],
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
          spotId: spots.find((spot) => spot.address === "123 Maple Street").id,
          userId: users.find((user) => user.username === "Demo-lition").id,
          startDate: "2021-11-19",
          endDate: "2021-11-20",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          spotId: spots.find((spot) => spot.address === "456 Oak Avenue").id,
          userId: users.find((user) => user.username === "FakeUser1").id,
          startDate: "2021-12-01",
          endDate: "2021-12-05",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          spotId: spots.find((spot) => spot.address === "789 Pine Road").id,
          userId: users.find((user) => user.username === "FakeUser2").id,
          startDate: "2022-01-10",
          endDate: "2022-01-15",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          spotId: spots.find((spot) => spot.address === "101 Beach Boulevard")
            .id,
          userId: users.find((user) => user.username === "Demo-lition").id,
          startDate: "2025-02-20",
          endDate: "2025-02-25",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          spotId: spots.find(
            (spot) => spot.address === "202 Mountain View Drive"
          ).id,
          userId: users.find((user) => user.username === "FakeUser1").id,
          startDate: "2022-03-15",
          endDate: "2022-03-20",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { validate: true }
    );
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = "Bookings";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, null, {});
  },
};
