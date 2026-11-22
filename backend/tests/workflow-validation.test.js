
const {
    createWorkflowDocument
} = require("../src/models/workflow.model");

// Valid workflow sample
const validWorkflow = {
    name: "Temperature Monitoring",
    description: "Monitor temperature and trigger alerts",
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
        },
        {
            id: "node_3",
            type: "actionTrigger",
            position: { x: 600, y: 150 },
            config: { action: "sendAlert" }
        }
    ],
    edges: [
        { id: "edge_1", source: "node_1", target: "node_2" },
        { id: "edge_2", source: "node_2", target: "node_3" }
    ]
};

// Test runner: supports both successful and expected-error tests
const runTest = (testName, testFunction, shouldFail = false) => {
    try {
        testFunction();

        if (shouldFail) {
            console.error(`FAIL: ${testName} - Expected validation error`);
            process.exitCode = 1;
        } else {
            console.log(`PASS: ${testName}`);
        }
    } catch (error) {
        if (shouldFail) {
            console.log(`PASS: ${testName}`);
        } else {
            console.error(`FAIL: ${testName} - ${error.message}`);
            process.exitCode = 1;
        }
    }
};

// Test 1: Create a valid workflow
runTest("Create a valid workflow", () => {
    const result = createWorkflowDocument(validWorkflow);

    if (result.nodes.length !== 3 || result.edges.length !== 2) {
        throw new Error("Incorrect workflow nodes or edges");
    }

    if (!(result.createdAt instanceof Date)) {
        throw new Error("Invalid createdAt timestamp");
    }

    if (!(result.updatedAt instanceof Date)) {
        throw new Error("Invalid updatedAt timestamp");
    }
});

// Test 2: Reject an empty workflow name
runTest("Reject an empty workflow name", () => {
    createWorkflowDocument({
        ...validWorkflow,
        name: " "
    });
}, true);

// Test 3: Reject duplicate node IDs
runTest("Reject duplicate node IDs", () => {
    createWorkflowDocument({
        ...validWorkflow,
        nodes: [
            ...validWorkflow.nodes,
            { ...validWorkflow.nodes[0] }
        ]
    });
}, true);

// Test 4: Reject invalid node positions
runTest("Reject invalid node positions", () => {
    createWorkflowDocument({
        ...validWorkflow,
        nodes: [
            {
                ...validWorkflow.nodes[0],
                position: { x: "100", y: 150 }
            }
        ],
        edges: []
    });
}, true);

// Test 5: Reject an edge with an unknown source
runTest("Reject an edge with an unknown source", () => {
    createWorkflowDocument({
        ...validWorkflow,
        edges: [
            { id: "edge_1", source: "unknown", target: "node_2" }
        ]
    });
}, true);

// Test 6: Reject duplicate edge IDs
runTest("Reject duplicate edge IDs", () => {
    createWorkflowDocument({
        ...validWorkflow,
        edges: [
            { id: "edge_1", source: "node_1", target: "node_2" },
            { id: "edge_1", source: "node_2", target: "node_3" }
        ]
    });
}, true);

// Test 7: Allow an empty workflow draft
runTest("Allow an empty workflow draft", () => {
    const result = createWorkflowDocument({
        name: "New Workflow",
        nodes: [],
        edges: []
    });

    if (result.nodes.length !== 0 || result.edges.length !== 0) {
        throw new Error("Empty workflow draft was not accepted");
    }
});
