// backend/routes/api/index.js
const router = require("express").Router();
const sessionRouter = require("./session.js");
const usersRouter = require("./users.js");
const spotsRouter = require("./spots.js");
const bookingsRouter = require("./bookings");
const reviewsRouter = require("./reviews.js");
const reviewImagesRouter = require("./review-images.js");
const spotImagesRouter = require("./spot-images.js");

const { restoreUser } = require("../../utils/auth.js");
const { requireAuth } = require("../../utils/auth.js");

router.use(restoreUser);

router.get("/restore-user", (req, res) => {
  return res.json(req.user);
});

router.use("/spot-images", spotImagesRouter);

router.use("/session", sessionRouter);

router.use("/users", usersRouter);

router.use("/spots", spotsRouter);

router.use("/bookings", bookingsRouter);

router.use("/reviews", reviewsRouter);

router.use("/review-images", reviewImagesRouter);

// router.post("/test", (req, res) => {
//   res.json({ requestBody: req.body });
// });

// router.post("/test", function (req, res) {
//   res.json({ requestBody: req.body });
// });

router.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

// router.get("/set-token-cookie", async (_req, res) => {
//   const user = await User.findOne({
//     where: {
//       username: "Demo-lition",
//     },
//   });
//   setTokenCookie(res, user);
//   return res.json({ user: user });
// });

router.get("/require-auth", requireAuth, (req, res) => {
  return res.json(req.user);
});

router.stack.forEach(function (r) {
  if (r.route && r.route.path) {
    console.log(r.route.path);
  }
});

module.exports = router;
