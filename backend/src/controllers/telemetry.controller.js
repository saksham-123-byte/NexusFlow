
const { getDB } = require("../config/database");

module.exports.healthCheck = (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Telemetry API is working"
    });
};

module.exports.receiveTelemetry = async (req, res) => {
    try {
        const { timestamp, metadata, value, unit, status } = req.body;

        // Validate required fields
        if (
            !timestamp ||
            !metadata ||
            !metadata.deviceId ||
            !metadata.sensorType ||
            !metadata.source ||
            typeof value !== "number" ||
            !unit ||
            !status
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid telemetry data. Please provide all required fields."
            });
        }

        // Convert timestamp into a JavaScript Date
        const telemetryTimestamp = new Date(timestamp);

        if (Number.isNaN(telemetryTimestamp.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid timestamp format"
            });
        }

        // Prepare telemetry document
        const telemetryData = {
            timestamp: telemetryTimestamp,
            metadata: {
                deviceId: metadata.deviceId,
                sensorType: metadata.sensorType,
                source: metadata.source
            },
            value,
            unit,
            status
        };

        // Insert document into MongoDB
        const db = getDB();
        const result = await db.collection("telemetry").insertOne(telemetryData);

        return res.status(201).json({
            success: true,
            message: "Telemetry data stored successfully",
            insertedId: result.insertedId,
            data: telemetryData
        });

    } catch (error) {
        console.error("Telemetry storage error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to store telemetry data"
        });
    }
};
