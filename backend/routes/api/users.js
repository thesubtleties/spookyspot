const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");

const { setTokenCookie } = require("../../utils/auth");
const { User } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

// Validation Middleware
const validateSignup = [
  check("email")
    .exists({ checkFalsy: true })
    .withMessage("Invalid email")
    .isEmail()
    .withMessage("Invalid email"),
  check("username")
    .exists({ checkFalsy: true })
    .withMessage("Username is required"),
  check("firstName")
    .exists({ checkFalsy: true })
    .withMessage("First Name is required"),
  check("lastName")
    .exists({ checkFalsy: true })
    .withMessage("Last Name is required"),
  check("password")
    .exists({ checkFalsy: true })
    .withMessage("Password is required"),
  handleValidationErrors,
];

// Sign Up Route
router.post("/", validateSignup, async (req, res) => {
  const { firstName, lastName, email, username, password } = req.body;

  // Check if a user with the same email or username already exists
  const existingUser = await User.findOne({
    where: {
      [Op.or]: [{ email }, { username }],
    },
  });

  if (existingUser) {
    const errors = {};
    if (existingUser.username === username) {
      errors.username = "User with that username already exists";
    } else {
      errors.email = "User with that email already exists";
    }
    console.log(existingUser);
    return res.status(500).json({
      message: "User already exists",
      errors,
    });
  }

  // Hash the password
  const hashedPassword = bcrypt.hashSync(password);

  // Create the new user
  const user = await User.create({
    firstName,
    lastName,
    email,
    username,
    hashedPassword,
  });

  // Prepare the response
  const safeUser = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    username: user.username,
  };

  // Set the token cookie
  await setTokenCookie(res, user);

  // Send response with status code 201
  return res.status(201).json({ user: safeUser });
});

module.exports = router;
