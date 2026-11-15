
const { getDB } = require("../config/database");
const { createTelemetryDocument } = require("../models/telemetry.model");

// Store a single telemetry document in MongoDB
const storeTelemetry = async (data) => {
    try {
        const telemetryDocument = createTelemetryDocument(data);

        const db = getDB();

        const result = await db
            .collection("telemetry")
            .insertOne(telemetryDocument);

        return {
            insertedId: result.insertedId,
            data: telemetryDocument
        };

    } catch (error) {
        console.error("Telemetry service error:", error.message);
        throw error;
    }
};

module.exports = {
    storeTelemetry
};
