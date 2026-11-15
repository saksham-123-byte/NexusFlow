
const createTelemetryDocument = (data) => {
    const {
        timestamp,
        metadata,
        value,
        unit,
        status
    } = data;

    // Validate required fields
    if (
        !timestamp ||
        !metadata ||
        !metadata.deviceId ||
        !metadata.sensorType ||
        !metadata.source ||
        typeof value !== "number" ||
        !Number.isFinite(value) ||
        !unit ||
        !status
    ) {
        throw new Error("Invalid telemetry data: missing or incorrect fields");
    }

    // Validate timestamp
    const telemetryTimestamp = new Date(timestamp);

    if (Number.isNaN(telemetryTimestamp.getTime())) {
        throw new Error("Invalid telemetry timestamp");
    }

    // Return standardized telemetry document
    return {
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
};

module.exports = {
    createTelemetryDocument
};
