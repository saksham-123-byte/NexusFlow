const express = require("express");

const telemetryRouter = express.Router();

// Temporary health-check route
telemetryRouter.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Telemetry API is working"
    });
});

module.exports = telemetryRouter;