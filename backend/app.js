const express = require("express");
require("express-async-errors");
const morgan = require("morgan");
const cors = require("cors");
const csurf = require("csurf");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const routes = require("./routes");
const { ValidationError } = require("sequelize");

const { environment } = require("./config");
const isProduction = environment === "production";

const app = express();

app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());

// CORS configuration
if (isProduction) {
  app.use(
    cors({
      origin: "https://spookyspot.sbtl.dev",
      credentials: true,
    })
  );
} else {
  app.use(
    cors({
      origin: "http://localhost:5173", // adjust if your frontend uses a different port
      credentials: true,
    })
  );
}

app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin",
  })
);

// CSRF protection only for API routes
app.use(
  "/api",
  csurf({
    cookie: {
      secure: isProduction,
      sameSite: isProduction && "Lax",
      httpOnly: true,
      domain: isProduction ? ".sbtl.dev" : undefined,
    },
    value: (req) => {
      console.log("=== CSRF Validation ===");
      console.log("Received token:", req.headers["xsrf-token"]);
      console.log("Cookie token:", req.cookies["_csrf"]);
      return req.headers["XSRF-TOKEN"];
    },
  })
);

app.use(routes);
// Catch unhandled requests and forward to error handler.
app.use((_req, _res, next) => {
  const err = new Error("The requested resource couldn't be found.");
  err.title = "Resource Not Found";
  err.errors = { message: "The requested resource couldn't be found." };
  err.status = 404;
  next(err);
});
// Process sequelize errors
app.use((err, _req, _res, next) => {
  // check if error is a Sequelize error:
  if (err instanceof ValidationError) {
    let errors = {};
    for (let error of err.errors) {
      errors[error.path] = error.message;
    }
    err.title = "Validation error";
    err.errors = errors;
  }
  next(err);
});
// Error formatter
app.use((err, _req, res, _next) => {
  res.status(err.status || 500);
  console.error(err);
  res.json({
    // title: err.title || "Server Error",
    message: err.message,
    errors: err.errors,
    stack: isProduction ? null : err.stack,
  });
});
module.exports = app;
