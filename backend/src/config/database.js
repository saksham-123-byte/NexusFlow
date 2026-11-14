
const { MongoClient } = require("mongodb");

let client;
let db;

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI;

        if (!uri) {
            throw new Error("MONGODB_URI is missing from .env");
        }

        client = new MongoClient(uri);
        await client.connect();

        db = client.db("nexusflow");

        console.log("MongoDB Atlas connected successfully");

        return db;
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        throw error;
    }
};

const initializeTimeSeriesCollection = async () => {
    try {
        const existing = await db
            .listCollections({ name: "telemetry" })
            .toArray();

        if (existing.length > 0) {
            const options = existing[0].options.timeseries;

            if (
                !options ||
                options.timeField !== "timestamp" ||
                options.metaField !== "metadata"
            ) {
                throw new Error(
                    "Existing telemetry collection has an unexpected configuration"
                );
            }

            console.log("Telemetry Time-Series collection already exists");
            return;
        }

        await db.createCollection("telemetry", {
            timeseries: {
                timeField: "timestamp",
                metaField: "metadata"
            }
        });

        console.log("Telemetry Time-Series collection created successfully");
    } catch (error) {
        console.error("Time-Series collection setup failed:", error.message);
        throw error;
    }
};

const getDB = () => {
    if (!db) {
        throw new Error("Database is not connected");
    }

    return db;
};

module.exports = {
    connectDB,
    initializeTimeSeriesCollection,
    getDB
};
