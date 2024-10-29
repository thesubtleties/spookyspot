// routes/index.js
const express = require("express");
const router = express.Router();
const apiRouter = require("./api");

// CSRF restore route - works for both dev and prod
// routes/index.js
router.get("/api/csrf/restore", (req, res) => {
  console.log("CSRF Restore Request:", {
    existingCSRF: req.cookies["_csrf"],
    existingXSRF: req.cookies["XSRF-TOKEN"],
    allCookies: req.cookies,
  });

  // Check for both cookies
  if (req.cookies["_csrf"] && req.cookies["XSRF-TOKEN"]) {
    console.log("Reusing existing tokens");
    return res.json({
      "XSRF-TOKEN": req.cookies["XSRF-TOKEN"],
    });
  }

  // Generate new token if either is missing
  console.log("Generating new token");
  const csrfToken = req.csrfToken(); // This sets _csrf cookie

  res.cookie("XSRF-TOKEN", csrfToken, {
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" && "Lax",
    httpOnly: false,
    domain: process.env.NODE_ENV === "production" ? "sbtl.dev" : undefined,
  });

  res.json({ "XSRF-TOKEN": csrfToken });
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
