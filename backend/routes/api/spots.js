const express = require("express");

const { Op, QueryInterface } = require("sequelize");
const bcrypt = require("bcryptjs");
const { setTokenCookie, restoreUser } = require("../../utils/auth");
const { Spot } = require("../../db/models");
const app = require("../../app");
const router = express.Router();
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

router.get("/", async (req, res) => {
  const allSpots = await Spot.findAll();
  res.json(allSpots);
});

module.exports = router;
