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
          [
            sequelize.fn("AVG", sequelize.col("Reviews.stars")),
            "avgRating",
          ],
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
    return res.status(500).json({ message: "Server error", errors: err.message });
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
      spotData.createdAt = new Date(spotData.createdAt).toISOString().replace('T', ' ').slice(0, 19);
      spotData.updatedAt = new Date(spotData.updatedAt).toISOString().replace('T', ' ').slice(0, 19);

      // Format avgRating to one decimal place if not null
      if (spotData.avgRating !== null) {
        spotData.avgRating = parseFloat(spotData.avgRating).toFixed(1);
      }

      return spotData;
    });

    return res.status(200).json({ Spots });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", errors: err.message });
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
  const spotId = req.params.spotId;

  // Find the spot by its ID
  const spot = await Spot.findByPk(spotId, {
    include: [
      // Include SpotImages
      {
        model: SpotImage,
        attributes: ["id", "url", "preview"],
      },
      // Include Owner (aliased User)
      {
        model: User, // Ensure User is correctly imported and used
        as: "Owner",
        attributes: ["id", "firstName", "lastName"],
      },
    ],
  });

  // If spot doesn't exist, return 404 error
  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }

  // Get number of reviews and average star rating
  const numReviews = await Review.count({
    where: { spotId },
  });

  let avgStarRating = 0;
  if (numReviews > 0) {
    const ratingSum = await Review.sum("stars", {
      where: { spotId },
    });
    avgStarRating = parseFloat((ratingSum / numReviews).toFixed(1));
  }

  // Convert spot instance to plain object
  const spotData = spot.toJSON();

  // Add numReviews and avgStarRating to spotData
  spotData.numReviews = numReviews;
  spotData.avgStarRating = avgStarRating;

  // Format createdAt and updatedAt
  const formatDate = (date) => {
    return new Date(date).toISOString().replace("T", " ").slice(0, 19);
  };
  spotData.createdAt = formatDate(spotData.createdAt);
  spotData.updatedAt = formatDate(spotData.updatedAt);

  return res.status(200).json(spotData);
});

module.exports = router;
