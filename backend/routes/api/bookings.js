const express = require("express");
const router = express.Router();
const { requireAuth } = require("../../utils/auth");
const { Booking, Spot } = require("../../db/models");

// Get all of the Current User's Bookings
router.get('/current', requireAuth, async (req, res) => {
  const userId = req.user.id; // Assuming req.user is set by requireAuth middleware

  try {
    const bookings = await Booking.findAll({
      where: { userId },
      include: {
        model: Spot,
        attributes: [
          'id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'
        ]
      }
    });

    // Manually format the response
    const formattedBookings = bookings.map(booking => ({
      id: booking.id,
      spotId: booking.spotId,
      Spot: {
        id: booking.Spot.id,
        ownerId: booking.Spot.ownerId,
        address: booking.Spot.address,
        city: booking.Spot.city,
        state: booking.Spot.state,
        country: booking.Spot.country,
        lat: booking.Spot.lat,
        lng: booking.Spot.lng,
        name: booking.Spot.name,
        price: booking.Spot.price
      },
      userId: booking.userId,
      startDate: booking.startDate,
      endDate: booking.endDate,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt
    }));

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ Bookings: formattedBookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
