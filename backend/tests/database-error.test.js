
const assert = require("node:assert/strict");

const {
    storeTelemetry
} = require("../src/services/telemetry.service");

const {
    getDB
} = require("../src/config/database");

const testDatabaseError = async () => {
    try {
        // Confirm that no database connection exists
        assert.throws(
            () => getDB(),
            /Database is not connected/
        );

        console.log("PASS: Detect unavailable database connection");

        // Attempt to store valid telemetry without connecting
        await assert.rejects(
            storeTelemetry({
                timestamp: new Date(),
                metadata: {
                    deviceId: "device_001",
                    sensorType: "temperature",
                    source: "sensor"
                },
                value: 28.5,
                unit: "celsius",
                status: "active"
            }),
            /Database is not connected/
        );

        console.log("PASS: Reject storage when database is disconnected");

    } catch (error) {
        console.error("FAIL:", error.message);
        process.exitCode = 1;
    }
};

testDatabaseError();
