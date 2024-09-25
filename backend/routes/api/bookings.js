const express = require("express");
const router = express.Router();
const { requireAuth } = require("../../utils/auth");
const { Booking, Spot, SpotImage } = require("../../db/models");
const { check, validationResult } = require("express-validator");
const { Op } = require("sequelize");

// Get all of the Current User's Bookings
router.get('/current', requireAuth, async (req, res) => {
  const userId = req.user.id;

    const bookings = await Booking.findAll({
      where: { userId },
      include: [
        {
          model: Spot,
          attributes: [
            'id', 'ownerId', 'address', 'city', 'state',
            'country', 'lat', 'lng', 'name', 'price'
          ],
          include: [
            {
              model: SpotImage,
              attributes: ['url'],
              // This sets the first image to be the preview of the array 
              where: { preview: true },
              required: false, 
            },
          ],
        },
      ],
    });

    const formattedBookings = bookings.map(booking => {
      // Convert the Spot model instance to a plain JavaScript object
      const spot = booking.Spot.toJSON();

      // Check if SpotImages exists and has at least one image
      // If so, set spot.previewImage to the URL of the first image
      // Otherwise, set spot.previewImage to null
      spot.previewImage = spot.SpotImages && spot.SpotImages.length > 0
        ? spot.SpotImages[0].url
        : null;

      // Remove the SpotImages property from the spot object
      // This is done because we only need the previewImage URL, not the entire array of images
      delete spot.SpotImages;

      // Return a new object representing the formatted booking
      // This includes the booking details and the associated spot details
      return {
        id: booking.id, // Booking ID
        spotId: booking.spotId, // ID of the associated spot
        Spot: spot, // The associated spot object with the previewImage
        userId: booking.userId, // ID of the user who made the booking
        startDate: booking.startDate, // Start date of the booking
        endDate: booking.endDate, // End date of the booking
        // Format createdAt to "YYYY-MM-DD HH:mm:ss"
        createdAt: booking.createdAt.toISOString().replace('T', ' ').slice(0, 19),
        // Format updatedAt to "YYYY-MM-DD HH:mm:ss"
        updatedAt: booking.updatedAt.toISOString().replace('T', ' ').slice(0, 19),
      };
    });

    // Set the Content-Type header to application/json
    res.setHeader('Content-Type', 'application/json');

    // Send a 200 OK response with the formatted bookings in JSON format
    res.status(200).json({ Bookings: formattedBookings });

});

module.exports = router;
