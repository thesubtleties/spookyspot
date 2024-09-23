const express = require("express");

const { Op, QueryInterface } = require("sequelize");
const bcrypt = require("bcryptjs");
const { setTokenCookie, restoreUser } = require("../../utils/auth");
const { Spot, Review } = require("../../db/models");

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

module.exports = router;
