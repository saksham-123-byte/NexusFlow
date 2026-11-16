
require("dotenv").config({ path: "./backend/.env" });

const {
    connectDB,
    initializeTimeSeriesCollection
} = require("../src/config/database");

const {
    storeMultipleTelemetry
} = require("../src/services/telemetry.service");

const testBulkInsert = async () => {
    try {
        await connectDB();
        await initializeTimeSeriesCollection();

        const telemetryData = [
            {
                timestamp: new Date(),
                metadata: {
                    deviceId: "device_001",
                    sensorType: "temperature",
                    source: "sensor"
                },
                value: 28.5,
                unit: "celsius",
                status: "active"
            },
            {
                timestamp: new Date(),
                metadata: {
                    deviceId: "device_002",
                    sensorType: "humidity",
                    source: "sensor"
                },
                value: 65,
                unit: "percent",
                status: "active"
            },
            {
                timestamp: new Date(),
                metadata: {
                    deviceId: "device_003",
                    sensorType: "pressure",
                    source: "sensor"
                },
                value: 1013.25,
                unit: "hPa",
                status: "active"
            }
        ];

        const result = await storeMultipleTelemetry(telemetryData);

        console.log("Bulk telemetry insertion successful!");
        console.log("Inserted count:", result.insertedCount);
        console.log("Inserted IDs:", result.insertedIds);

    } catch (error) {
        console.error("Bulk insertion test failed:", error.message);
        process.exitCode = 1;
    }
};

testBulkInsert();
