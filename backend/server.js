
require("dotenv").config();

const app = require("./src/app");
const {
    connectDB,
    initializeTimeSeriesCollection
} = require("./src/config/database");

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await connectDB();
        await initializeTimeSeriesCollection();

        app.listen(PORT, () => {
            console.log(`NexusFlow server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
};

startServer();
