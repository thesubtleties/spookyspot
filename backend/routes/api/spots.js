const express = require("express");
const router = express.Router();
const {
  Spot,
  Review,
  SpotImage,
  sequelize,
  User,
  Booking,
  ReviewImage,
} = require("../../db/models");
const { Op } = require("sequelize");
const { requireAuth } = require("../../utils/auth");
const { check, validationResult } = require("express-validator");

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
  const userId = req.user?.id;

  // Check if user is logged in
  if (!userId) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  // Find the spot
  const spot = await Spot.findByPk(spotId);

  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }

  // Check if the current user is the owner of the spot
  if (spot.ownerId !== userId) {
    return res.status(403).json({
      message: "Forbidden",
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
        [sequelize.fn("AVG", sequelize.col("Reviews.stars")), "avgStarRating"],
        // Include numReviews
        [sequelize.fn("COUNT", sequelize.col("Reviews.id")), "numReviews"],
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

router.post("/", requireAuth, async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;

  const spot = {
    ownerId: req.user.id,
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
  };
  const errorOptions = {
    address: "Street address is required",
    city: "City is required",
    state: "State is required",
    country: "Country is required",
    lat: "Latitude must be within -90 and 90",
    lng: "Longitude must be within -180 and 180",
    name: "Name is required",
    nameLength: "Name must be less than 50 characters",
    description: "Description is required",
    price: "Price per day must be a positive number",
  };
  const errorsObj = {};

  for (item in spot) {
    if (spot[item] === undefined) {
      errorsObj[item] = errorOptions[item];
    }
  }
  if (spot.name.length >= 50) {
    errorsObj.name = errorOptions.nameLength;
  }
  if (Object.entries(errorsObj).length > 0) {
    const responseError = {};
    responseError.message = "Bad Request";
    responseError.errors = errorsObj;
    return res.status(400).json(responseError);
  }
  const addedSpot = await Spot.create(spot);
  res.status(201).json(addedSpot);
});

router.put("/:spotId", requireAuth, async (req, res) => {
  const spotId = parseInt(req.params.spotId);
  const userId = req.user.id;
  const spot = await Spot.findByPk(spotId);
  const errorsObj = {};
  if (!spot) {
    errorsObj.message = "Spot couldn't be found";
    return res.status(404).json(errorsObj);
  }
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;
  const newSpotInfo = {
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
  };

  if (spot.ownerId !== userId) {
    errorsObj.message = "Cannot update a Spot you do not own";
    return res.status(400).json(errorsObj);
  }
  const errorOptions = {
    address: "Street address is required",
    city: "City is required",
    state: "State is required",
    country: "Country is required",
    lat: "Latitude must be within -90 and 90",
    lng: "Longitude must be within -180 and 180",
    name: "Name is required",
    nameLength: "Name must be less than 50 characters",
    description: "Description is required",
    price: "Price per day must be a positive number",
  };
  for (item in newSpotInfo) {
    if (newSpotInfo[item] === undefined) {
      errorsObj[item] = errorOptions[item];
    }
  }
  if (newSpotInfo.name.length >= 50) {
    errorsObj.name = errorOptions.nameLength;
  }
  if (Object.entries(errorsObj).length > 0) {
    const responseError = {};
    responseError.message = "Bad Request";
    responseError.errors = errorsObj;
    return res.status(400).json(responseError);
  }
  const updatedSpot = await Spot.findByPk(spotId);
  res.status(201).json(updatedSpot);
});

router.delete("/:spotId", requireAuth, async (req, res) => {
  const spotId = parseInt(req.params.spotId);
  const userId = req.user.id;

  const spot = await Spot.findByPk(spotId);

  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }

  if (spot.ownerId !== userId) {
    return res.status(403).json({
      message: "Forbidden",
    });
  }

  await spot.destroy();

  res.status(200).json({
    message: "Successfully deleted",
  });
});

// Get all Bookings for a Spot based on the Spot's id
router.get("/:spotId/bookings", requireAuth, async (req, res) => {
  const { spotId } = req.params;
  const userId = req.user.id;

  // Find the spot
  const spot = await Spot.findByPk(spotId);

  // If the spot doesn't exist, return a 404 error
  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
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
        attributes: ["id", "firstName", "lastName"],
      },
    });

    // Format the bookings
    const formattedBookings = bookings.map((booking) => ({
      User: booking.User,
      id: booking.id,
      spotId: booking.spotId,
      userId: booking.userId,
      startDate: booking.startDate,
      endDate: booking.endDate,
      createdAt: booking.createdAt.toISOString().replace("T", " ").slice(0, 19),
      updatedAt: booking.updatedAt.toISOString().replace("T", " ").slice(0, 19),
    }));

    // Send the response
    return res.status(200).json({ Bookings: formattedBookings });
  } else {
    // Fetch bookings with limited information
    const bookings = await Booking.findAll({
      where: { spotId },
      attributes: ["spotId", "startDate", "endDate"],
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

  try {
    // Find the spot
    const spot = await Spot.findByPk(spotId);

    if (!spot) {
      return res.status(404).json({
        message: "Spot couldn't be found",
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
      const conflictErrors = {};

      // Check for start date conflicts
      const startDateConflict = conflictingBookings.some(
        (booking) =>
          new Date(startDate) >= new Date(booking.startDate) &&
          new Date(startDate) <= new Date(booking.endDate)
      );
      if (startDateConflict) {
        conflictErrors.startDate =
          "Start date conflicts with an existing booking";
      }

      // Check for end date conflicts
      const endDateConflict = conflictingBookings.some(
        (booking) =>
          new Date(endDate) >= new Date(booking.startDate) &&
          new Date(endDate) <= new Date(booking.endDate)
      );
      if (endDateConflict) {
        conflictErrors.endDate = "End date conflicts with an existing booking";
      }

      if (Object.keys(conflictErrors).length > 0) {
        return res.status(403).json({
          message: "Sorry, this spot is already booked for the specified dates",
          errors: conflictErrors,
        });
      }
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

// Get all Reviews by a Spot's id
router.get("/:spotId/reviews", async (req, res) => {
  const { spotId } = req.params;

  try {
    const spot = await Spot.findByPk(spotId);

    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    const reviews = await Review.findAll({
      where: { spotId },
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName"],
        },
        {
          model: ReviewImage,
          attributes: ["id", "url"],
        },
      ],
    });

    const formattedReviews = reviews.map((review) => {
      const reviewData = review.toJSON();
      reviewData.ReviewImages = reviewData.ReviewImages || [];
      return reviewData;
    });

    res.status(200).json({ Reviews: formattedReviews });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", errors: err.message });
  }
});

// Create a Review for a Spot based on the Spot's id
router.post(
  "/:spotId/reviews",
  requireAuth,
  [
    check("review")
      .exists({ checkFalsy: true })
      .withMessage("Review text is required"),
    check("stars")
      .isInt({ min: 1, max: 5 })
      .withMessage("Stars must be an integer from 1 to 5"),
  ],
  async (req, res) => {
    const { spotId } = req.params;
    const { review, stars } = req.body;
    const userId = req.user.id;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const formattedErrors = {};
      errors.array().forEach((error) => {
        formattedErrors[error.path] = error.msg;
      });
      return res.status(400).json({
        message: "Bad Request",
        errors: formattedErrors,
      });
    }

    try {
      const spot = await Spot.findByPk(spotId);

      if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" });
      }

      const existingReview = await Review.findOne({
        where: {
          spotId,
          userId,
        },
      });

      if (existingReview) {
        return res.status(500).json({
          message: "User already has a review for this spot",
        });
      }

      const newReview = await Review.create({
        spotId,
        userId,
        review,
        stars,
      });

      const formattedReview = {
        id: newReview.id,
        userId: newReview.userId,
        spotId: newReview.spotId,
        review: newReview.review,
        stars: newReview.stars,
        createdAt: newReview.createdAt
          .toISOString()
          .replace("T", " ")
          .slice(0, 19),
        updatedAt: newReview.updatedAt
          .toISOString()
          .replace("T", " ")
          .slice(0, 19),
      };

      res.status(201).json(formattedReview);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error", errors: err.message });
    }
  }
);

// delete a spot image

router.delete('/spot-images/:imageId', requireAuth, async (req, res) => {
  const { imageId } = req.params;
  const userId = req.user.id;

  try {
    const spotImage = await SpotImage.findByPk(imageId, {
      include: {
        model: Spot,
        attributes: ['ownerId']
      }
    });

    if (!spotImage) {
      return res.status(404).json({ message: "Spot Image couldn't be found" });
    }

    if (spotImage.Spot.ownerId !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await spotImage.destroy();

    res.status(200).json({ message: "Successfully deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
