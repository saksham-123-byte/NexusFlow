
const { getDB } = require("../config/database");

const {
    createTelemetryDocument,
    createMultipleTelemetryDocuments
} = require("../models/telemetry.model");

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

// Store multiple telemetry documents in MongoDB
const storeMultipleTelemetry = async (dataArray) => {
    try {
        const telemetryDocuments =
            createMultipleTelemetryDocuments(dataArray);

        const db = getDB();

        const result = await db
            .collection("telemetry")
            .insertMany(telemetryDocuments);

        return {
            insertedCount: result.insertedCount,
            insertedIds: result.insertedIds
        };

    } catch (error) {
        console.error("Bulk telemetry service error:", error.message);
        throw error;
    }
};

// Retrieve telemetry records from MongoDB
const getTelemetryRecords = async (limit = 100) => {
    try {
        if (
            !Number.isInteger(limit) ||
            limit < 1 ||
            limit > 1000
        ) {
            throw new Error("Limit must be an integer between 1 and 1000");
        }

        const db = getDB();

        const records = await db
            .collection("telemetry")
            .find({})
            .sort({ timestamp: -1 })
            .limit(limit)
            .toArray();

        return {
            count: records.length,
            data: records
        };

    } catch (error) {
        console.error("Telemetry retrieval error:", error.message);
        throw error;
    }
};

module.exports = {
    storeTelemetry,
    storeMultipleTelemetry,
    getTelemetryRecords
};
