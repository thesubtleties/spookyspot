const express = require("express");

const { Op, QueryInterface } = require("sequelize");
const bcrypt = require("bcryptjs");
const { setTokenCookie, restoreUser } = require("../../utils/auth");
const { Spot, Review, SpotImage } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const app = require("../../app");
const router = express.Router();
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

router.get("/:spotId/reviews", async (req, res) => {
  const spotId = req.params.spotId;

  const spotIdReviews = await Review.findAll({
    where: {
      spotId,
    },
  });
  res.status(200).json(spotIdReviews);
});

router.post("/spotId/reviews", async (req, res) => {
  const spotId = req.params.spotId;
  const newReview = req.body;
  let submittedReview;
  try {
    submittedReview = await Review.create(newReview);
  } catch (err) {
    return res.status(400).json(err.message);
  }
  res.status(201).json(submittedReview);
});

router.get("/", async (req, res) => {
  const allSpots = await Spot.findAll();
  res.json(allSpots);
});

router.post("/:spotId/images", requireAuth, async (req, res) => {
  const { spotId } = req.params;
  const { url, preview } = req.body;

  // Find the spot
  const spot = await Spot.findByPk(spotId);

  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }

  // Create the image
  const newImage = await SpotImage.create({
    spotId,
    url,
    preview,
  });

  return res.status(201).json({
    id: newImage.id,
    url: newImage.url,
    preview: newImage.preview,
  });
});

module.exports = router;
