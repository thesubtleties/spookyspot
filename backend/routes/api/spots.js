const express = require("express");
const router = express.Router();
const { Spot, Review, SpotImage, sequelize, User, Booking } = require("../../db/models");
const { Op } = require("sequelize");
const { requireAuth } = require("../../utils/auth");

// Get all Spots
router.get("/", async (req, res) => {
    // Fetch all spots
    const spots = await Spot.findAll({
      attributes: {
        include: [
          // Include avgRating
          [sequelize.fn("AVG", sequelize.col("Reviews.stars")), "avgRating"],
        ],
      },
      include: [
        // Include associated Reviews
        {
          model: Review,
          attributes: [],
        },
        // Include associated SpotImages to get previewImage
        {
          model: SpotImage,
          attributes: ["url", "preview"],
        },
      ],
      group: ["Spot.id", "SpotImages.id"],
    });

    // Format the spots data
    const Spots = spots.map((spot) => {
      const spotData = spot.toJSON();

      // Get previewImage URL where preview is true
      const previewImageObj = spotData.SpotImages.find(
        (image) => image.preview === true
      );
      spotData.previewImage = previewImageObj ? previewImageObj.url : null;

      // Remove SpotImages array from spotData
      delete spotData.SpotImages;

      // Format avgRating to one decimal place if not null
      if (spotData.avgRating !== null) {
        spotData.avgRating = parseFloat(spotData.avgRating).toFixed(1);
      }

      return spotData;
    });

    return res.status(200).json({ Spots });

});

// Get all Spots owned by the Current User
router.get("/current", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch all spots where ownerId matches current user
    const spots = await Spot.findAll({
      where: {
        ownerId: userId,
      },
      attributes: {
        include: [
          // Include avgRating
          [
            sequelize.literal(`(
              SELECT AVG("Reviews"."stars")
              FROM "Reviews"
              WHERE "Reviews"."spotId" = "Spot"."id"
            )`),
            "avgRating",
          ],
          // Include previewImage
          [
            sequelize.literal(`(
              SELECT "url"
              FROM "SpotImages"
              WHERE "SpotImages"."spotId" = "Spot"."id" AND "SpotImages"."preview" = true
              LIMIT 1
            )`),
            "previewImage",
          ],
        ],
      },
    });

    // Format spots data
    const Spots = spots.map((spot) => {
      const spotData = spot.toJSON();

      // Format createdAt and updatedAt to 'YYYY-MM-DD HH:mm:ss'
      spotData.createdAt = new Date(spotData.createdAt)
        .toISOString()
        .replace("T", " ")
        .slice(0, 19);
      spotData.updatedAt = new Date(spotData.updatedAt)
        .toISOString()
        .replace("T", " ")
        .slice(0, 19);

      // Format avgRating to one decimal place if not null
      if (spotData.avgRating !== null) {
        spotData.avgRating = parseFloat(spotData.avgRating).toFixed(1);
      }

      return spotData;
    });

    return res.status(200).json({ Spots });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", errors: err.message });
  }
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

// Get details of a Spot from an id
router.get("/:spotId", async (req, res) => {
  const { spotId } = req.params;

  // Find the spot by its ID with aggregated avgStarRating and numReviews
  const spot = await Spot.findOne({
    where: { id: spotId },
    attributes: {
      include: [
        // Include avgStarRating
        [
          sequelize.fn("AVG", sequelize.col("Reviews.stars")),
          "avgStarRating",
        ],
        // Include numReviews
        [
          sequelize.fn("COUNT", sequelize.col("Reviews.id")),
          "numReviews",
        ],
      ],
    },
    include: [
      // Include associated Reviews for aggregation
      {
        model: Review,
        attributes: [],
      },
      // Include SpotImages
      {
        model: SpotImage,
        attributes: ["id", "url", "preview"],
      },
      // Include Owner (aliased User)
      {
        model: User,
        as: "Owner",
        attributes: ["id", "firstName", "lastName"],
      },
    ],
    group: ["Spot.id", "SpotImages.id", "Owner.id"],
  });

  // If spot doesn't exist, return 404 error
  if (!spot) {
    return res.status(404).json({
      message: "Couldn't find a Spot with the specified id",
    });
  }

  // Convert spot instance to plain object
  const spotData = spot.toJSON();

  // Format avgStarRating to one decimal place if not null
  if (spotData.avgStarRating !== null) {
    spotData.avgStarRating = parseFloat(spotData.avgStarRating).toFixed(1);
  } else {
    spotData.avgStarRating = null;
  }

  // Format numReviews as integer
  spotData.numReviews = parseInt(spotData.numReviews) || 0;

  // Format createdAt and updatedAt
  const formatDate = (date) => {
    return new Date(date).toISOString().replace("T", " ").slice(0, 19);
  };
  spotData.createdAt = formatDate(spotData.createdAt);
  spotData.updatedAt = formatDate(spotData.updatedAt);

  return res.status(200).json(spotData);
});

router.post("/", async (req, res) => {
  const spot = req.body;
  console.log(spot);
  try {
    const addedSpot = await Spot.create(spot);
  } catch (err) {
    return res.json(err);
  }
  res.json(addedSpot);
});

// Get all Bookings for a Spot based on the Spot's id
router.get('/:spotId/bookings', requireAuth, async (req, res) => {
  const { spotId } = req.params;
  const userId = req.user.id;

  // Find the spot
  const spot = await Spot.findByPk(spotId);

  // If the spot doesn't exist, return a 404 error
  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found"
    });
  }

  // Check if the current user is the owner of the spot
  const isOwner = spot.ownerId === userId;

  if (isOwner) {
    // Fetch bookings including User information
    const bookings = await Booking.findAll({
      where: { spotId },
      include: {
        model: User,
        attributes: ['id', 'firstName', 'lastName']
      }
    });

    // Format the bookings
    const formattedBookings = bookings.map(booking => ({
      User: booking.User,
      id: booking.id,
      spotId: booking.spotId,
      userId: booking.userId,
      startDate: booking.startDate,
      endDate: booking.endDate,
      createdAt: booking.createdAt.toISOString().replace('T', ' ').slice(0, 19),
      updatedAt: booking.updatedAt.toISOString().replace('T', ' ').slice(0, 19)
    }));

    // Send the response
    return res.status(200).json({ Bookings: formattedBookings });
  } else {
    // Fetch bookings with limited information
    const bookings = await Booking.findAll({
      where: { spotId },
      attributes: ['spotId', 'startDate', 'endDate']
    });

    // Send the response
    return res.status(200).json({ Bookings: bookings });
  }
});

// Create a Booking from a Spot based on the Spot's id
router.post("/:spotId/bookings", requireAuth, async (req, res, next) => {
  const { spotId } = req.params;
  const { startDate, endDate } = req.body;
  const userId = req.user.id;

  // Convert dates to Date objects
  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();

  // Validation errors
  const errors = {};

  // Check if startDate is in the past
  if (start < today) {
    errors.startDate = "startDate cannot be in the past";
  }

  // Check if endDate is on or before startDate
  if (end <= start) {
    errors.endDate = "endDate cannot be on or before startDate";
  }

  // If there are validation errors, return 400
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: "Bad Request",
      errors,
    });
  }

  try {
    // Find the spot
    const spot = await Spot.findByPk(spotId);

    if (!spot) {
      return res.status(404).json({
        message: "Spot couldn't be found",
      });
    }

    // Check if the spot belongs to the current user
    if (spot.ownerId === userId) {
      return res.status(403).json({
        message: "Forbidden: You cannot book your own spot",
      });
    }

    // Check for booking conflicts
    const conflictingBookings = await Booking.findAll({
      where: {
        spotId: spotId,
        [Op.or]: [
          {
            startDate: {
              [Op.between]: [startDate, endDate],
            },
          },
          {
            endDate: {
              [Op.between]: [startDate, endDate],
            },
          },
          {
            startDate: {
              [Op.lte]: startDate,
            },
            endDate: {
              [Op.gte]: endDate,
            },
          },
        ],
      },
    });

    if (conflictingBookings.length > 0) {
      return res.status(403).json({
        message: "Sorry, this spot is already booked for the specified dates",
        errors: {
          startDate: "Start date conflicts with an existing booking",
          endDate: "End date conflicts with an existing booking",
        },
      });
    }

    // Create the booking
    const booking = await Booking.create({
      spotId: spotId,
      userId: userId,
      startDate: startDate,
      endDate: endDate,
    });

    // Format createdAt and updatedAt
    const formattedBooking = booking.toJSON();
    formattedBooking.createdAt = new Date(formattedBooking.createdAt)
      .toISOString()
      .replace("T", " ")
      .slice(0, 19);
    formattedBooking.updatedAt = new Date(formattedBooking.updatedAt)
      .toISOString()
      .replace("T", " ")
      .slice(0, 19);

    return res.status(201).json(formattedBooking);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
