
const assert = require("node:assert/strict");
const { firstValueFrom } = require("rxjs");

const {
    executeWorkflow
} = require("../src/services/workflow-engine.service");

const {
    parseWorkflowGraph
} = require("../src/services/graph-parser.service");

const createWorkflow = () => ({
    name: "Day 5 Integration Test",
    nodes: [
        {
            id: "source",
            type: "DATA_SOURCE",
            position: { x: 0, y: 0 },
            config: { value: 10 }
        },
        {
            id: "math",
            type: "MATH_OPERATION",
            position: { x: 200, y: 0 },
            config: { operation: "multiply", operand: 5 }
        },
        {
            id: "action",
            type: "ACTION_TRIGGER",
            position: { x: 400, y: 0 },
            config: {
                action: "log",
                message: "Workflow completed"
            }
        }
    ],
    edges: [
        { id: "e1", source: "source", target: "math" },
        { id: "e2", source: "math", target: "action" }
    ]
});

let passed = 0;
let failed = 0;

const test = async (name, callback) => {
    try {
        await callback();
        console.log(`PASS: ${name}`);
        passed++;
    } catch (error) {
        console.error(`FAIL: ${name} - ${error.message}`);
        failed++;
    }
};

const runTests = async () => {

    await test("Graph Parser determines correct execution order", () => {
        const workflow = createWorkflow();

        const orderedNodes = parseWorkflowGraph(workflow);

        assert.deepEqual(
            orderedNodes.map(node => node.id),
            ["source", "math", "action"]
        );
    });

    await test("Complete workflow executes through RxJS", async () => {
        const workflow = createWorkflow();

        const result = await firstValueFrom(
            executeWorkflow(workflow)
        );

        assert.equal(result.success, true);
        assert.deepEqual(
            result.executionOrder,
            ["source", "math", "action"]
        );

        assert.equal(result.nodeResults.source, 10);
        assert.equal(result.nodeResults.math, 50);
        assert.equal(result.nodeResults.action.data, 50);
    });

    await test("Workflow tracks failed node execution", async () => {
        const workflow = createWorkflow();

        // Configure the math node to trigger division by zero
        workflow.nodes[1].config = {
            operation: "divide",
            operand: 0
        };

        let executionError;

        try {
            await firstValueFrom(executeWorkflow(workflow));
        } catch (error) {
            executionError = error;
        }

        assert.ok(executionError);

        assert.equal(executionError.nodeId, "math");
        assert.equal(executionError.nodeType, "MATH_OPERATION");

        assert.equal(
            executionError.executionHistory.length,
            2
        );

        assert.deepEqual(
            executionError.executionHistory.map(item => item.status),
            ["SUCCESS", "FAILED"]
        );

        assert.deepEqual(
            executionError.executionSummary,
            {
                totalNodes: 3,
                successfulNodes: 1,
                failedNodes: 1
            }
        );
    });


    await test("Workflow rejects invalid edge references", () => {
        const workflow = createWorkflow();

        workflow.edges[0].target = "unknown-node";

        assert.throws(
            () => parseWorkflowGraph(workflow),
            /unknown node/
        );
    });

    await test("Workflow records execution history", async () => {
        const workflow = createWorkflow();

        const result = await firstValueFrom(
            executeWorkflow(workflow)
        );

        assert.equal(result.executionHistory.length, 3);

        assert.deepEqual(
            result.executionHistory.map(item => item.status),
            ["SUCCESS", "SUCCESS", "SUCCESS"]
        );

        assert.equal(
            result.executionHistory[0].output,
            10
        );

        assert.equal(
            result.executionHistory[1].input,
            10
        );

        assert.equal(
            result.executionHistory[1].output,
            50
        );
    });

    await test("Workflow provides execution summary", async () => {
        const workflow = createWorkflow();

        const result = await firstValueFrom(
            executeWorkflow(workflow)
        );

        assert.deepEqual(result.executionSummary, {
            totalNodes: 3,
            successfulNodes: 3,
            failedNodes: 0
        });
    });


    await test("Graph Parser rejects cyclic workflows", () => {
        const workflow = {
            name: "Cycle Test",
            nodes: [
                {
                    id: "source",
                    type: "DATA_SOURCE",
                    config: { value: 10 }
                },
                {
                    id: "mathA",
                    type: "MATH_OPERATION",
                    config: { operation: "add", operand: 5 }
                },
                {
                    id: "mathB",
                    type: "MATH_OPERATION",
                    config: { operation: "multiply", operand: 2 }
                }
            ],
            edges: [
                { id: "e1", source: "mathA", target: "mathB" },
                { id: "e2", source: "mathB", target: "mathA" }
            ]
        };

        assert.throws(
            () => parseWorkflowGraph(workflow),
            /cycle/
        );
    });

    
await test("Workflow rejects unsupported node types", async () => {
    const workflow = {
        name: "Unsupported Node Test",
        nodes: [
            {
                id: "source",
                type: "DATA_SOURCE",
                config: { value: 10 }
            },
            {
                id: "unknown",
                type: "UNKNOWN_NODE",
                config: {}
            }
        ],
        edges: [
            {
                id: "e1",
                source: "source",
                target: "unknown"
            }
        ]
    };

    await assert.rejects(
        firstValueFrom(executeWorkflow(workflow)),
        /Unsupported node type/
    );
});

    console.log("\n========== DAY 5 TEST SUMMARY ==========");
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    console.log("========================================");

    if (failed > 0) {
        process.exitCode = 1;
    }
};

runTests();
