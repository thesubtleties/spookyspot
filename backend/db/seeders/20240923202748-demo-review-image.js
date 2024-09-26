"use strict";
const { ReviewImage } = require("../models");

/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; 
}
module.exports = {
  async up(queryInterface, Sequelize) {
    await ReviewImage.bulkCreate(
      [
        {
          reviewId: 1,
          url: "https://a0.muscache.com/im/pictures/airflow/Hosting-20015611/original/e9f5c2d1-a3e6-4bf5-b0fc-7b8048b1d8c0.jpg?im_w=1200",
        },
        {
          reviewId: 1,
          url: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-569489573960444825/original/16396a4d-82c4-4380-a205-68e1399348db.jpeg?im_w=1200",
        },
        {
          reviewId: 1,
          url: "https://a0.muscache.com/im/pictures/miso/Hosting-590582018455894127/original/2b84faac-62a0-4db7-b40b-1ad12876b84d.jpeg?im_w=960",
        },
        {
          reviewId: 2,
          url: "https://media.architecturaldigest.com/photos/6373ff246e5bc3f908f88205/16:9/w_1600%2Cc_limit/Casa%2520Tierra%2520Airbnb%2520-%2520Bedroom%25202%2520-%2520Credit%2520Sara%2520Ligorria-Tramp.jpg",
        },
        {
          reviewId: 2,
          url: "https://example.com/review2-image2.jpg",
        },
        {
          reviewId: 3,
          url: "https://example.com/review3-image1.jpg",
        },
        {
          reviewId: 4,
          url: "https://example.com/review4-image1.jpg",
        },
        {
          reviewId: 4,
          url: "https://example.com/review4-image2.jpg",
        },
      ],
      {
        validate: true,
      }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "ReviewImages";
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete("ReviewImages", null, {});
  },
};
