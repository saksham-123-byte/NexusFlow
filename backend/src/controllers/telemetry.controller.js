const { storeTelemetry } = require("../services/telemetry.service");

// Health check
module.exports.healthCheck = (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Telemetry API is working"
    });
};

// Receive and store telemetry data
module.exports.receiveTelemetry = async (req, res) => {
    try {
        const result = await storeTelemetry(req.body);

        return res.status(201).json({
            success: true,
            message: "Telemetry data stored successfully",
            insertedId: result.insertedId,
            data: result.data
        });

    } catch (error) {
        console.error("Telemetry controller error:", error.message);

        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.statusCode === 400
                ? error.message
                : "Failed to store telemetry data"
        });
    }
};