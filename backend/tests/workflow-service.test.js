
require("dotenv").config({ path: "./backend/.env" });

const {
    connectDB,
    initializeTimeSeriesCollection,
    closeDB
} = require("../src/config/database");

const {
    saveWorkflow,
    getWorkflowById,
    getAllWorkflows
} = require("../src/services/workflow.service");

const testWorkflowService = async () => {
    let insertedId;

    try {
        // Connect to MongoDB
        await connectDB();
        await initializeTimeSeriesCollection();

        console.log("\nMongoDB connection successful!");

        // Test 1: Save a workflow
        const workflowData = {
            name: "Temperature Monitoring Test",
            description: "Test workflow persistence",
            version: 1,
            nodes: [
                {
                    id: "node_1",
                    type: "dataSource",
                    position: { x: 100, y: 150 },
                    config: { deviceId: "device_001" }
                },
                {
                    id: "node_2",
                    type: "mathOperation",
                    position: { x: 350, y: 150 },
                    config: { operation: "multiply", value: 2 }
                }
            ],
            edges: [
                {
                    id: "edge_1",
                    source: "node_1",
                    target: "node_2"
                }
            ]
        };

        const savedWorkflow = await saveWorkflow(workflowData);

        insertedId = savedWorkflow.insertedId;

        console.log("\nPASS: Save workflow");
        console.log("Inserted ID:", insertedId.toString());

        // Test 2: Retrieve workflow by ID
        const retrievedWorkflow = await getWorkflowById(
            insertedId.toString()
        );

        if (
            !retrievedWorkflow ||
            retrievedWorkflow.name !== workflowData.name
        ) {
            throw new Error("Workflow retrieval by ID failed");
        }

        console.log("PASS: Retrieve workflow by ID");
        console.log("Retrieved name:", retrievedWorkflow.name);

        // Test 3: Retrieve all workflows
        const allWorkflows = await getAllWorkflows(10);

        if (!allWorkflows.data.some(
            (workflow) => workflow._id.equals(insertedId)
        )) {
            throw new Error("Saved workflow not found in workflow list");
        }

        console.log("PASS: Retrieve all workflows");
        console.log("Total workflows found:", allWorkflows.count);

        console.log("\nAll workflow service tests passed!");

    } catch (error) {
        console.error("\nWorkflow service test failed:", error.message);
        process.exitCode = 1;

    } finally {
        // Close database connection
        await closeDB();
    }
};

testWorkflowService();
