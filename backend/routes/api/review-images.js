const express = require("express");

const { Op, QueryInterface } = require("sequelize");
const bcrypt = require("bcryptjs");
const { setTokenCookie, restoreUser } = require("../../utils/auth");
const { Review, ReviewImage } = require("../../db/models");
const app = require("../../app");
const router = express.Router();
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

router.delete("/:imageId", async (req, res) => {
  const { imageId } = req.params;
  console.log(imageId);
  const obj = {};
  try {
    await ReviewImage.destroy({
      where: {
        id: imageId,
      },
    });
  } catch (err) {
    obj.message = "Review Image couldn't be found";
    return res.status(400).json(obj);
  }
  obj.message = "Successfully deleted";
  res.status(200).json(obj);
});

module.exports = router;
