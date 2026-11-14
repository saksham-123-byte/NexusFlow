const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const telemetryRouter = require("./routes/telemetry.routes");
app.use("/api/telemetry", telemetryRouter);


module.exports = app;