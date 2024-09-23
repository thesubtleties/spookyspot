const express = require("express");

const { Op, QueryInterface } = require("sequelize");
const bcrypt = require("bcryptjs");
const { setTokenCookie, restoreUser } = require("../../utils/auth");
const { Review } = require("../../db/models");
const app = require("../../app");
const router = express.Router();
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

router.get("/current", async (req, res) => {
  const { user } = req;
  const ourReviews = await Review.findAll({
    where: {
      userId: user.id,
    },
  });
  res.status(200).json(ourReviews);
});

module.exports = router;
