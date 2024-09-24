const express = require("express");
const router = express.Router();
const { Spot, Review, SpotImage, sequelize, User } = require("../../db/models");
const { Op } = require("sequelize");
const { requireAuth } = require("../../utils/auth");

// Get all Spots
router.get("/", async (req, res) => {
  try {
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
  } catch (err) {
    console.error(err); // Log the error for debugging
    return res
      .status(500)
      .json({ message: "Server error", errors: err.message });
  }
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
      message: "Spot couldn't be found",
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

module.exports = router;
