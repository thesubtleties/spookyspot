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

    if (demoSpots.length === 0) {
      console.error("No spots found. Ensure the spots exist in the database.");
      return;
    }

    await SpotImage.bulkCreate(
      [
        {
          spotId: demoSpots.find((spot) => spot.name === "Whisper Manor").id,
          url: "https://i.ibb.co/7gDKbrM/victorian1.png",
          preview: true,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Whisper Manor").id,
          url: "https://i.ibb.co/QKmyQvY/victorian2.png",
          preview: false,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Whisper Manor").id,
          url: "https://i.ibb.co/zGkwKRz/victorian3.png",
          preview: false,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Crypt Cavern Inn").id,
          url: "https://i.ibb.co/LnNmfxL/cave1.png",
          preview: true,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Crypt Cavern Inn").id,
          url: "https://i.ibb.co/VvnsxNH/cave2.png",
          preview: false,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Crypt Cavern Inn").id,
          url: "https://i.ibb.co/S0qCjvS/cave3.png",
          preview: false,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Banshee's Bungalow")
            .id,
          url: "https://i.ibb.co/zZK6ZBW/cottage1.png",
          preview: true,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Banshee's Bungalow")
            .id,
          url: "https://i.ibb.co/6vGtspP/cottage2.png",
          preview: false,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Banshee's Bungalow")
            .id,
          url: "https://i.ibb.co/mDzZLHF/cottage3.png",
          preview: false,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Phantom Lighthouse")
            .id,
          url: "https://i.ibb.co/Htf5RqR/lighthouse1.png",
          preview: true,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Phantom Lighthouse")
            .id,
          url: "https://i.ibb.co/Xkw97cr/lighthouse2.png",
          preview: false,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Phantom Lighthouse")
            .id,
          url: "https://i.ibb.co/qnh0FMn/lighthouse3.png",
          preview: false,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Witch's Treehouse")
            .id,
          url: "https://i.ibb.co/606jQRK/treehouse1.png",
          preview: true,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Witch's Treehouse")
            .id,
          url: "https://i.ibb.co/2vTq5N0/treehouse2.png",
          preview: false,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Witch's Treehouse")
            .id,
          url: "https://i.ibb.co/NZRJVyn/treehouse3.png",
          preview: false,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Dracula's Chateau")
            .id,
          url: "https://i.ibb.co/chx8fH7/castle1.png",
          preview: true,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Dracula's Chateau")
            .id,
          url: "https://i.ibb.co/TBk09tJ/castle2.png",
          preview: false,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Dracula's Chateau")
            .id,
          url: "https://i.ibb.co/fvy7cqr/castle3.png",
          preview: false,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Werewolf Lodge").id,
          url: "https://i.ibb.co/Y7JBqCy/cabin1.png",
          preview: true,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Werewolf Lodge").id,
          url: "https://i.ibb.co/xHDTgQ4/cabin2.png",
          preview: false,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Werewolf Lodge").id,
          url: "https://i.ibb.co/KrS9w2H/cabin3.png",
          preview: false,
        },
        {
          spotId: demoSpots.find(
            (spot) => spot.name === "Mermaid's Sunken Palace"
          ).id,
          url: "https://i.ibb.co/XV532fp/underwater1.png",
          preview: true,
        },
        {
          spotId: demoSpots.find(
            (spot) => spot.name === "Mermaid's Sunken Palace"
          ).id,
          url: "https://i.ibb.co/fS1XS5P/underwater2.png",
          preview: false,
        },
        {
          spotId: demoSpots.find(
            (spot) => spot.name === "Mermaid's Sunken Palace"
          ).id,
          url: "https://i.ibb.co/zhXTDcv/underwater3.png",
          preview: false,
        },
        {
          spotId: demoSpots.find(
            (spot) => spot.name === "Pharaoh's Pyramid Retreat"
          ).id,
          url: "https://i.ibb.co/vQYMpsB/pyramid1.png",
          preview: true,
        },
        {
          spotId: demoSpots.find(
            (spot) => spot.name === "Pharaoh's Pyramid Retreat"
          ).id,
          url: "https://i.ibb.co/LnQPyXn/pyramid2.png",
          preview: false,
        },
        {
          spotId: demoSpots.find(
            (spot) => spot.name === "Pharaoh's Pyramid Retreat"
          ).id,
          url: "https://i.ibb.co/hfBHsZJ/pyramid3.png",
          preview: false,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Alien Abode").id,
          url: "https://i.ibb.co/HTtMYXn/ufo1.png",
          preview: true,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Alien Abode").id,
          url: "https://i.ibb.co/zr0BYyh/ufo2.png",
          preview: false,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Alien Abode").id,
          url: "https://i.ibb.co/CzxHQfj/ufo3.png",
          preview: false,
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "SpotImages";
    return queryInterface.bulkDelete(options, null, {});
  },
};
