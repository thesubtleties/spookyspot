// routes/index.js
const express = require("express");
const router = express.Router();
const apiRouter = require("./api");

// CSRF restore route - works for both dev and prod
// routes/index.js
router.get("/api/csrf/restore", (req, res) => {
  // Only generate new token if one doesn't exist
  if (!req.cookies["_csrf"]) {
    const csrfToken = req.csrfToken();
    res.cookie("XSRF-TOKEN", csrfToken, {
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" && "Lax",
      httpOnly: false,
      domain: process.env.NODE_ENV === "production" ? ".sbtl.dev" : undefined,
    });
    res.json({ "XSRF-TOKEN": csrfToken });
  } else {
    // If token exists, just send the existing one
    res.json({ "XSRF-TOKEN": req.cookies["XSRF-TOKEN"] });
  }
});
router.use("/api", apiRouter);

// Development-only routes
if (process.env.NODE_ENV !== "production") {
  // Static serving for development
  const path = require("path");
  router.use(express.static(path.resolve("../frontend/dist")));

  router.get("/", (req, res) => {
    return res.sendFile(
      path.resolve(__dirname, "../../frontend", "dist", "index.html")
    );
  });
}

module.exports = router;
