const express = require("express");
const router = express.Router();
const { Spot, Review, SpotImage, sequelize } = require("../../db/models");
const { Op } = require("sequelize");

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

module.exports = router;
