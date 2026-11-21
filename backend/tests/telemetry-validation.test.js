
const assert = require("node:assert/strict");

const {
    createTelemetryDocument,
    createMultipleTelemetryDocuments
} = require("../src/models/telemetry.model");

const {
    getTelemetryRecords
} = require("../src/services/telemetry.service");

const validTelemetry = {
    timestamp: "2026-11-20T10:30:00.000Z",
    metadata: {
        deviceId: "device_001",
        sensorType: "temperature",
        source: "sensor"
    },
    value: 28.5,
    unit: "celsius",
    status: "active"
};

// Run synchronous validation tests
const runTest = (description, testFunction) => {
    try {
        testFunction();
        console.log("PASS:", description);
    } catch (error) {
        console.error("FAIL:", description);
        console.error(error.message);
        process.exitCode = 1;
    }
};

// 1. Valid telemetry
runTest("Accept valid telemetry data", () => {
    const result = createTelemetryDocument(validTelemetry);

    assert.ok(result.timestamp instanceof Date);
    assert.equal(result.metadata.deviceId, "device_001");
    assert.equal(result.value, 28.5);
});

// 2. Missing deviceId
runTest("Reject missing deviceId", () => {
    const invalidData = {
        ...validTelemetry,
        metadata: {
            sensorType: "temperature",
            source: "sensor"
        }
    };

    assert.throws(
        () => createTelemetryDocument(invalidData),
        /Invalid telemetry data/
    );
});

// 3. Invalid timestamp
runTest("Reject invalid timestamp", () => {
    const invalidData = {
        ...validTelemetry,
        timestamp: "invalid-date"
    };

    assert.throws(
        () => createTelemetryDocument(invalidData),
        /Invalid telemetry timestamp/
    );
});

// 4. String value
runTest("Reject string telemetry value", () => {
    const invalidData = {
        ...validTelemetry,
        value: "28.5"
    };

    assert.throws(
        () => createTelemetryDocument(invalidData),
        /Invalid telemetry data/
    );
});

// 5. NaN value
runTest("Reject NaN telemetry value", () => {
    const invalidData = {
        ...validTelemetry,
        value: NaN
    };

    assert.throws(
        () => createTelemetryDocument(invalidData),
        /Invalid telemetry data/
    );
});

// 6. Infinity value
runTest("Reject infinite telemetry value", () => {
    const invalidData = {
        ...validTelemetry,
        value: Infinity
    };

    assert.throws(
        () => createTelemetryDocument(invalidData),
        /Invalid telemetry data/
    );
});

// 7. Empty bulk array
runTest("Reject empty bulk telemetry array", () => {
    assert.throws(
        () => createMultipleTelemetryDocuments([]),
        /non-empty array/
    );
});

// 8. Non-array bulk input
runTest("Reject non-array bulk input", () => {
    assert.throws(
        () => createMultipleTelemetryDocuments(validTelemetry),
        /non-empty array/
    );
});

// 9. Invalid record in bulk array
runTest("Reject invalid record in bulk input", () => {
    const invalidData = {
        ...validTelemetry,
        value: "invalid"
    };

    assert.throws(
        () => createMultipleTelemetryDocuments([
            validTelemetry,
            invalidData
        ]),
        /Invalid telemetry data/
    );
});

// 10. Invalid retrieval limits
const testRetrievalLimits = async () => {
    const invalidLimits = [0, 1001, 1.5, "10"];

    for (const limit of invalidLimits) {
        await assert.rejects(
            getTelemetryRecords(limit),
            /Limit must be an integer between 1 and 1000/
        );
    }

    console.log("PASS: Reject invalid retrieval limits");
};

// Run asynchronous test after synchronous tests
const main = async () => {
    try {
        await testRetrievalLimits();
    } catch (error) {
        console.error("FAIL: Invalid retrieval limits");
        console.error(error.message);
        process.exitCode = 1;
    }
};

main();
