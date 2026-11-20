
require("dotenv").config({ path: "./backend/.env" });

const {
    connectDB,
    initializeTimeSeriesCollection,
    closeDB
} = require("../src/config/database");

const {
    getTelemetryRecords
} = require("../src/services/telemetry.service");

const testRetrieval = async () => {
    try {
        // Connect to MongoDB
        await connectDB();
        await initializeTimeSeriesCollection();

        // Retrieve the latest 10 telemetry records
        const result = await getTelemetryRecords(10);

        console.log("Telemetry retrieval successful!");
        console.log("Records found:", result.count);
        console.log("Retrieved records:");
        console.log(JSON.stringify(result.data, null, 2));

    } catch (error) {
        console.error("Telemetry retrieval test failed:", error.message);
        process.exitCode = 1;

    } finally {
        await closeDB();
    }
};

testRetrieval();
