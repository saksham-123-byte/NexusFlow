module.exports.healthCheck = (req, res) => {
  return res.status(200).json({
        success: true,
        message: "Telemetry API is working"
    });
}

module.exports.receiveTelemetry = (req,res)=> {
   try {
        const telemetryData = req.body;

        console.log("Received Telemetry Data:", telemetryData);

        return res.status(200).json({
            success: true,
            message: "Telemetry data received successfully",
            data: telemetryData
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}