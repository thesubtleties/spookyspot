"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const spots = await queryInterface.sequelize.query(
      `SELECT id, address FROM Spots WHERE address IN ('123 Maple Street', '456 Oak Avenue', '789 Pine Road', '101 Beach Boulevard', '202 Mountain View Drive');`
    );

    const users = await queryInterface.sequelize.query(
      `SELECT id, username FROM Users WHERE username IN ('Demo-lition', 'FakeUser1', 'FakeUser2');`
    );

    const spotRows = spots[0];
    const userRows = users[0];

    await queryInterface.bulkInsert(
      "bookings",
      [
        {
          spotId: spotRows.find((spot) => spot.address === "123 Maple Street")
            .id,
          userId: userRows.find((user) => user.username === "Demo-lition").id,
          startDate: "2021-11-19",
          endDate: "2021-11-20",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          spotId: spotRows.find((spot) => spot.address === "456 Oak Avenue").id,
          userId: userRows.find((user) => user.username === "FakeUser1").id,
          startDate: "2021-12-01",
          endDate: "2021-12-05",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          spotId: spotRows.find((spot) => spot.address === "789 Pine Road").id,
          userId: userRows.find((user) => user.username === "FakeUser2").id,
          startDate: "2022-01-10",
          endDate: "2022-01-15",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          spotId: spotRows.find(
            (spot) => spot.address === "101 Beach Boulevard"
          ).id,
          userId: userRows.find((user) => user.username === "Demo-lition").id,
          startDate: "2025-02-20",
          endDate: "2025-02-25",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          spotId: spotRows.find(
            (spot) => spot.address === "202 Mountain View Drive"
          ).id,
          userId: userRows.find((user) => user.username === "FakeUser1").id,
          startDate: "2022-03-15",
          endDate: "2022-03-20",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("bookings", null, {});
  },
};
