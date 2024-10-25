// routes/index.js
const express = require("express");
const router = express.Router();
const apiRouter = require("./api");

router.use("/api", apiRouter);

// CSRF restore route - works for both dev and prod
router.get("/api/csrf/restore", (req, res) => {
  const csrfToken = req.csrfToken();
  res.cookie("XSRF-TOKEN", csrfToken);
  res.status(200).json({
    "XSRF-Token": csrfToken,
  });
});

// Development-only routes
if (process.env.NODE_ENV !== "production") {
  // Static serving for development
  const path = require("path");
  router.use(express.static(path.resolve("../frontend/dist")));
  
  router.get("/", (req, res) => {
    res.cookie("XSRF-TOKEN", req.csrfToken());
    return res.sendFile(
      path.resolve(__dirname, "../../frontend", "dist", "index.html")
    );
  });
}

module.exports = router;