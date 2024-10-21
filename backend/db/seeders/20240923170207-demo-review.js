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
          [Op.in]: ["Demo-lition", "FakeUser1", "FakeUser2"],
        },
      },
      attributes: ["id", "username"],
    });

    const demoSpots = await Spot.findAll({
      where: {
        name: {
          [Op.in]: [
            "Whisper Manor",
            "Crypt Cavern Inn",
            "Banshee's Bungalow",
            "Phantom Lighthouse",
            "Witch's Treehouse",
            "Dracula's Chateau",
            "Werewolf Lodge",
            "Mermaid's Sunken Palace",
            "Pharaoh's Pyramid Retreat",
            "Alien Abode",
          ],
        },
      },
      attributes: ["id", "name"],
    });

    await Review.bulkCreate(
      [
        {
          spotId: demoSpots.find((spot) => spot.name === "Whisper Manor").id,
          userId: demoUsers.find((user) => user.username === "FakeUser1").id,
          review:
            "Truly haunting experience! The ghostly ballroom dance was unforgettable.",
          stars: 5,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Crypt Cavern Inn").id,
          userId: demoUsers.find((user) => user.username === "Demo-lition").id,
          review:
            "Chillingly cozy. The skeleton staff was surprisingly accommodating.",
          stars: 4,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Banshee's Bungalow")
            .id,
          userId: demoUsers.find((user) => user.username === "FakeUser2").id,
          review:
            "Hauntingly beautiful. The banshee's lullaby was actually quite soothing.",
          stars: 5,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Phantom Lighthouse")
            .id,
          userId: demoUsers.find((user) => user.username === "FakeUser1").id,
          review:
            "Spectacular views and spine-tingling atmosphere. Watch out for the ghostly keeper!",
          stars: 4,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Witch's Treehouse")
            .id,
          userId: demoUsers.find((user) => user.username === "Demo-lition").id,
          review:
            "Magical stay! The flying books were a bit of a hazard though.",
          stars: 4,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Dracula's Chateau")
            .id,
          userId: demoUsers.find((user) => user.username === "FakeUser2").id,
          review:
            "Absolutely fang-tastic! The Bloody Mary at the bar was to die for.",
          stars: 5,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Werewolf Lodge").id,
          userId: demoUsers.find((user) => user.username === "FakeUser1").id,
          review: "Howlingly good time! The full moon view was spectacular.",
          stars: 4,
        },
        {
          spotId: demoSpots.find(
            (spot) => spot.name === "Mermaid's Sunken Palace"
          ).id,
          userId: demoUsers.find((user) => user.username === "Demo-lition").id,
          review:
            "An underwater dream! The bioluminescent display was mesmerizing.",
          stars: 5,
        },
        {
          spotId: demoSpots.find(
            (spot) => spot.name === "Pharaoh's Pyramid Retreat"
          ).id,
          userId: demoUsers.find((user) => user.username === "FakeUser2").id,
          review:
            "Felt like ancient royalty! The sarcophagus bar was a unique touch.",
          stars: 4,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Alien Abode").id,
          userId: demoUsers.find((user) => user.username === "FakeUser1").id,
          review:
            "Out of this world experience! The anti-gravity shower was a trip.",
          stars: 5,
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Reviews";
    return queryInterface.bulkDelete(options, null, {});
  },
};
