
const { from, of, defer } = require("rxjs");

const {
    concatMap,
    toArray,
    map
} = require("rxjs/operators");

const { parseWorkflowGraph } = require("./graph-parser.service");
const { executeNode } = require("./node-execution.service");

// Execute workflow nodes sequentially and maintain execution history
const executeWorkflow = (workflow) => {
    const orderedNodes = parseWorkflowGraph(workflow);

    const nodeResults = new Map();
    const executionHistory = [];

    return from(orderedNodes).pipe(
        concatMap((node) =>
            defer(() => {
                const inputData = node.inputNodeId
                    ? nodeResults.get(node.inputNodeId)
                    : undefined;

                try {
                    const output = executeNode(node, inputData);

                    nodeResults.set(node.id, output);

                    const historyEntry = {
                        nodeId: node.id,
                        nodeType: node.type,
                        input: inputData,
                        output,
                        status: "SUCCESS"
                    };

                    executionHistory.push(historyEntry);

                    return of({
                        nodeId: node.id,
                        output,
                        historyEntry
                    });
                } catch (error) {
                    const historyEntry = {
                        nodeId: node.id,
                        nodeType: node.type,
                        input: inputData,
                        status: "FAILED",
                        error: error.message
                    };

                    executionHistory.push(historyEntry);

                    const executionError = new Error(
                        `Workflow execution failed at node ${node.id}: ${error.message}`,
                        { cause: error }
                    );

                    executionError.nodeId = node.id;
                    executionError.nodeType = node.type;
                    executionError.executionHistory = [...executionHistory];

                    executionError.executionSummary = {
                        totalNodes: orderedNodes.length,
                        successfulNodes: executionHistory.filter(
                            item => item.status === "SUCCESS"
                        ).length,
                        failedNodes: 1
                    };

                    throw executionError;
                }
            })
        ),

        toArray(),

        map((executions) => {
            const results = Object.fromEntries(
                executions.map((item) => [
                    item.nodeId,
                    item.output
                ])
            );

            return {
                success: true,
                executionOrder: executions.map(
                    item => item.nodeId
                ),
                nodeResults: results,
                executionHistory,
                executionSummary: {
                    totalNodes: executions.length,
                    successfulNodes: executions.length,
                    failedNodes: 0
                },
                finalOutput: executions.length > 0
                    ? executions[executions.length - 1].output
                    : null
            };
        })
    );
};

module.exports = {
    executeWorkflow
};
