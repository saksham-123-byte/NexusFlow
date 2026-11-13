const express = require("express");
const { healthCheck,receiveTelemetry }= require("../controllers/telemetry.controller");
const telemetryRouter = express.Router();

// Temporary health-check route
telemetryRouter.get("/health", healthCheck);

telemetryRouter.post("/receive", receiveTelemetry);

module.exports = telemetryRouter;