const express = require("express");
const { Review, ReviewImage, User, Spot, SpotImage } = require("../../db/models");
const router = express.Router();
const { requireAuth } = require("../../utils/auth");
const { check, validationResult } = require("express-validator");

// Add an Image to a Review based on the Review's id
router.post(
  "/:reviewId/images",
  requireAuth,
  [
    check("url")
      .exists({ checkFalsy: true })
      .withMessage("URL is required")
      .isURL()
      .withMessage("URL must be valid"),
  ],
  async (req, res) => {
    const { reviewId } = req.params;
    const { url } = req.body;
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
      const review = await Review.findByPk(reviewId);

      if (!review) {
        return res.status(404).json({ message: "Review couldn't be found" });
      }

      if (review.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const imageCount = await ReviewImage.count({
        where: { reviewId },
      });

      if (imageCount >= 10) {
        return res.status(403).json({
          message: "Maximum number of images for this resource was reached",
        });
      }

      const newImage = await ReviewImage.create({
        reviewId,
        url,
      });

      res.status(201).json({
        id: newImage.id,
        url: newImage.url,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error", errors: err.message });
    }
  }
);


// Get all Reviews of the Current User
router.get("/current", requireAuth, async (req, res) => {
  const userId = req.user.id;
  const reviews = await Review.findAll({
    where: { userId },
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
      {
        model: Spot,
        attributes: [
          "id",
          "ownerId",
          "address",
          "city",
          "state",
          "country",
          "lat",
          "lng",
          "name",
          "price",
        ],
        include: [
          {
            model: SpotImage,
            attributes: ["url"],
            where: { preview: true },
            required: false,
          },
        ],
      },
      {
        model: ReviewImage,
        attributes: ["id", "url"],
      },
    ],
  });

  const formattedReviews = reviews.map((review) => {
    const reviewData = review.toJSON();
    reviewData.Spot.previewImage = reviewData.Spot.SpotImages.length
      ? reviewData.Spot.SpotImages[0].url
      : null;
    delete reviewData.Spot.SpotImages;
    return reviewData;
  });

  res.status(200).json({ Reviews: formattedReviews });
});

module.exports = router;
