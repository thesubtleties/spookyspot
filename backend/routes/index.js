// routes/index.js
const express = require("express");
const router = express.Router();
const apiRouter = require("./api");

router.use("/api", apiRouter);

// For local development
if (process.env.NODE_ENV !== "production") {
  router.get("/api/csrf/restore", (req, res) => {
    res.cookie("XSRF-TOKEN", req.csrfToken());
    return res.json({});
  });

  // Keep your local static serving
  const path = require("path");
  router.use(express.static(path.resolve("../frontend/dist")));
  router.get("/", (req, res) => {
    res.cookie("XSRF-TOKEN", req.csrfToken());
    return res.sendFile(
      path.resolve(__dirname, "../../frontend", "dist", "index.html")
    );
  });
}

// For production (Docker) - only need API routes
if (process.env.NODE_ENV === "production") {
  router.get("/api/csrf/restore", (req, res) => {
    const csrfToken = req.csrfToken();
    res.cookie("XSRF-TOKEN", csrfToken);
    res.status(200).json({
      "XSRF-Token": csrfToken,
    });
  });
}

module.exports = router;
