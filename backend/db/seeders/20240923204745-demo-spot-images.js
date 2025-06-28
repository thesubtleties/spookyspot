"use strict";

const { SpotImage, Spot } = require("../models");
const { Op } = require("sequelize");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

const BASE_URL = "https://storage.sbtl.dev/spookyspot";

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
          url: `${BASE_URL}/victorian1.png`,
          preview: true,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Whisper Manor").id,
          url: `${BASE_URL}/victorian2.png`,
          preview: false,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Whisper Manor").id,
          url: `${BASE_URL}/victorian3.png`,
          preview: false,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Crypt Cavern Inn").id,
          url: `${BASE_URL}/cave1.png`,
          preview: true,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Crypt Cavern Inn").id,
          url: `${BASE_URL}/cave2.png`,
          preview: false,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Crypt Cavern Inn").id,
          url: `${BASE_URL}/cave3.png`,
          preview: false,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Banshee's Bungalow")
            .id,
          url: `${BASE_URL}/cottage1.png`,
          preview: true,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Banshee's Bungalow")
            .id,
          url: `${BASE_URL}/cottage2.png`,
          preview: false,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Banshee's Bungalow")
            .id,
          url: `${BASE_URL}/cottage3.png`,
          preview: false,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Phantom Lighthouse")
            .id,
          url: `${BASE_URL}/lighthouse1.png`,
          preview: true,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Phantom Lighthouse")
            .id,
          url: `${BASE_URL}/lighthouse2.png`,
          preview: false,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Phantom Lighthouse")
            .id,
          url: `${BASE_URL}/lighthouse3.png`,
          preview: false,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Witch's Treehouse")
            .id,
          url: `${BASE_URL}/treehouse1.png`,
          preview: true,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Witch's Treehouse")
            .id,
          url: `${BASE_URL}/treehouse2.png`,
          preview: false,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Witch's Treehouse")
            .id,
          url: `${BASE_URL}/treehouse3.png`,
          preview: false,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Dracula's Chateau")
            .id,
          url: `${BASE_URL}/castle1.png`,
          preview: true,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Dracula's Chateau")
            .id,
          url: `${BASE_URL}/castle2.png`,
          preview: false,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Dracula's Chateau")
            .id,
          url: `${BASE_URL}/castle3.png`,
          preview: false,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Werewolf Lodge").id,
          url: `${BASE_URL}/cabin1.png`,
          preview: true,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Werewolf Lodge").id,
          url: `${BASE_URL}/cabin2.png`,
          preview: false,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Werewolf Lodge").id,
          url: `${BASE_URL}/cabin3.png`,
          preview: false,
        },
        {
          spotId: demoSpots.find(
            (spot) => spot.name === "Mermaid's Sunken Palace"
          ).id,
          url: `${BASE_URL}/underwater1.png`,
          preview: true,
        },
        {
          spotId: demoSpots.find(
            (spot) => spot.name === "Mermaid's Sunken Palace"
          ).id,
          url: `${BASE_URL}/underwater2.png`,
          preview: false,
        },
        {
          spotId: demoSpots.find(
            (spot) => spot.name === "Mermaid's Sunken Palace"
          ).id,
          url: `${BASE_URL}/underwater3.png`,
          preview: false,
        },
        {
          spotId: demoSpots.find(
            (spot) => spot.name === "Pharaoh's Pyramid Retreat"
          ).id,
          url: `${BASE_URL}/pyramid1.png`,
          preview: true,
        },
        {
          spotId: demoSpots.find(
            (spot) => spot.name === "Pharaoh's Pyramid Retreat"
          ).id,
          url: `${BASE_URL}/pyramid2.png`,
          preview: false,
        },
        {
          spotId: demoSpots.find(
            (spot) => spot.name === "Pharaoh's Pyramid Retreat"
          ).id,
          url: `${BASE_URL}/pyramid3.png`,
          preview: false,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Alien Abode").id,
          url: `${BASE_URL}/ufo1.png`,
          preview: true,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Alien Abode").id,
          url: `${BASE_URL}/ufo2.png`,
          preview: false,
        },
        {
          spotId: demoSpots.find((spot) => spot.name === "Alien Abode").id,
          url: `${BASE_URL}/ufo3.png`,
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
