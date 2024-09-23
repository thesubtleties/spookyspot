const express = require("express");

const { Op, QueryInterface } = require("sequelize");
const bcrypt = require("bcryptjs");
const { setTokenCookie, restoreUser } = require("../../utils/auth");
const { Review, ReviewImage } = require("../../db/models");
const app = require("../../app");
const router = express.Router();
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

router.post("/:reviewId/images", async (req, res) => {
  const { reviewId } = req.params;
  const { url } = req.body;
  try {
    const newImage = await ReviewImage.create({
      reviewId,
      url,
    });
    return res.status(201).json(newImage);
  } catch (err) {
    res.status(400).json(err.message);
  }
});

router.get("/current", async (req, res) => {
  const { user } = req;
  console.log("userID:", user.id);
  const ourReviews = await Review.findAll({
    where: {
      userId: user.id,
    },
  });
  res.status(200).json(ourReviews);
});

module.exports = router;
