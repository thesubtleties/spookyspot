"use strict";

const { Spot, User } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    const demoUsers = await User.findAll({
      attributes: ["id", "username"],
      where: {
        username: ["Demo-lition", "FakeUser1", "FakeUser2"],
      },
    });

    await Spot.bulkCreate(
      [
        {
          ownerId: demoUsers.find((user) => user.username === "Demo-lition").id,
          address: "13 Specter Lane",
          city: "Shadowville",
          state: "Transylvania",
          country: "Romania",
          lat: 45.7489,
          lng: 21.2087,
          name: "Whisper Manor",
          description:
            "A grand Victorian mansion where whispers echo through the halls and ghostly figures dance in the moonlit ballroom. Perfect for those seeking an elegant haunting experience.",
          price: 666,
        },
        {
          ownerId: demoUsers.find((user) => user.username === "Demo-lition").id,
          address: "666 Underworld Avenue",
          city: "Necropolis",
          state: "Hades",
          country: "Underworld",
          lat: 37.8044,
          lng: -122.2712,
          name: "Crypt Cavern Inn",
          description:
            "Nestled deep underground, this unique inn offers a bone-chilling stay with its skeleton staff and eerie ambiance. Don't miss the spirits at the ghostly bar!",
          price: 99,
        },
        {
          ownerId: demoUsers.find((user) => user.username === "Demo-lition").id,
          address: "7 Wail Way",
          city: "Mournful Meadows",
          state: "Ethereal",
          country: "Ireland",
          lat: 53.3498,
          lng: -6.2603,
          name: "Banshee's Bungalow",
          description:
            "A cozy cottage on the misty moors where the cries of banshees lull you to sleep. Enjoy the warmth of the hearth while spectral figures flit by.",
          price: 150,
        },
        {
          ownerId: demoUsers.find((user) => user.username === "FakeUser1").id,
          address: "1 Foghorn Fright",
          city: "Mist Harbor",
          state: "Spectral Shores",
          country: "Atlantic",
          lat: 43.8563,
          lng: -66.1127,
          name: "Phantom Lighthouse",
          description:
            "Stand watch with the ghostly keeper in this historic lighthouse. Brave the spiral staircase for breathtaking views of the stormy, haunted seas.",
          price: 250,
        },
        {
          ownerId: demoUsers.find((user) => user.username === "FakeUser1").id,
          address: "22 Spellbound Street",
          city: "Enchanted Forest",
          state: "Mystic",
          country: "Fairyland",
          lat: 51.1789,
          lng: -1.8262,
          name: "Witch's Treehouse",
          description:
            "Perched in an ancient tree, this magical abode offers a unique stay among flying books and bubbling cauldrons. Perfect for aspiring witches and warlocks.",
          price: 333,
        },
        {
          ownerId: demoUsers.find((user) => user.username === "FakeUser1").id,
          address: "666 Vampire Vista",
          city: "Sighișoara",
          state: "Transylvania",
          country: "Romania",
          lat: 46.2197,
          lng: 24.7964,
          name: "Dracula's Chateau",
          description:
            "Experience the luxurious undead lifestyle in this gothic castle nestled in the Transylvanian mountains. Enjoy panoramic views of bat-filled night skies and misty forests. Don't forget to try the Bloody Mary at our coffin-shaped bar!",
          price: 1000,
        },
        {
          ownerId: demoUsers.find((user) => user.username === "FakeUser2").id,
          address: "13 Moonlight Trail",
          city: "Lupine Grove",
          state: "Montana",
          country: "United States",
          lat: 46.8797,
          lng: -110.3626,
          name: "Werewolf Lodge",
          description:
            "Embrace your wild side in this rustic log cabin. Howl at the moon from our custom moon-viewing window and enjoy the comfort of our fur rugs and antler chandeliers. Perfect for a transformative getaway!",
          price: 450,
        },
        {
          ownerId: demoUsers.find((user) => user.username === "FakeUser2").id,
          address: "Ocean Floor, Sector 7",
          city: "Atlantis",
          state: "Pacific",
          country: "Oceania",
          lat: -8.7832,
          lng: 124.5085,
          name: "Mermaid's Sunken Palace",
          description:
            "Dive into luxury in this underwater dome house. Surrounded by vibrant coral reefs and mysterious shipwrecks, you'll experience the magic of living under the sea. Our bioluminescent algae garden offers a mesmerizing nighttime display.",
          price: 1500,
        },
        {
          ownerId: demoUsers.find((user) => user.username === "FakeUser2").id,
          address: "1 Sphinx Road",
          city: "Giza",
          state: "Cairo Governorate",
          country: "Egypt",
          lat: 29.9773,
          lng: 31.1325,
          name: "Pharaoh's Pyramid Retreat",
          description:
            "Step back in time in this modern pyramid house. Explore hieroglyph-covered walls, relax by our Nile-inspired pool, and enjoy a drink at the golden sarcophagus bar. Experience the luxury of ancient Egypt with all modern amenities.",
          price: 800,
        },
        {
          ownerId: demoUsers.find((user) => user.username === "Demo-lition").id,
          address: "Area 51, Hangar 18",
          city: "Roswell",
          state: "New Mexico",
          country: "United States",
          lat: 33.3943,
          lng: -104.523,
          name: "Alien Abode",
          description:
            "Beam yourself up to this out-of-this-world flying saucer house. Featuring levitating furniture, a holographic entertainment system, and an anti-gravity shower, this home is truly from another planet. Crop circle view included!",
          price: 1200,
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Spots";
    return queryInterface.bulkDelete(options, null, {});
  },
};
