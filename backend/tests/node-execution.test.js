
const {
    executeDataSource,
    executeMathOperation,
    executeActionTrigger,
    executeNode
} = require("../src/services/node-execution.service");

let passed = 0;
let failed = 0;

const test = (name, callback) => {
    try {
        callback();
        console.log(`PASS: ${name}`);
        passed++;
    } catch (error) {
        console.error(`FAIL: ${name} - ${error.message}`);
        failed++;
    }
};

const expectEqual = (actual, expected) => {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(
            `Expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`
        );
    }
};

const expectError = (callback, message) => {
    try {
        callback();
        throw new Error("Expected an error but none was thrown");
    } catch (error) {
        if (error.message === "Expected an error but none was thrown") {
            throw error;
        }

        if (message && !error.message.includes(message)) {
            throw new Error(`Expected error containing "${message}", received "${error.message}"`);
        }
    }
};

// DATA SOURCE TESTS
test("Data Source returns configured value", () => {
    const node = {
        type: "DATA_SOURCE",
        config: { value: 10 }
    };

    expectEqual(executeDataSource(node), 10);
});

test("Data Source rejects invalid value", () => {
    const node = {
        type: "DATA_SOURCE",
        config: { value: "10" }
    };

    expectError(() => executeDataSource(node), "finite number");
});

// MATH OPERATION TESTS
test("Math addition works correctly", () => {
    const node = {
        type: "MATH_OPERATION",
        config: { operation: "add", operand: 5 }
    };

    expectEqual(executeMathOperation(node, 10), 15);
});

test("Math subtraction works correctly", () => {
    const node = {
        type: "MATH_OPERATION",
        config: { operation: "subtract", operand: 5 }
    };

    expectEqual(executeMathOperation(node, 10), 5);
});

test("Math multiplication works correctly", () => {
    const node = {
        type: "MATH_OPERATION",
        config: { operation: "multiply", operand: 5 }
    };

    expectEqual(executeMathOperation(node, 10), 50);
});

test("Math division works correctly", () => {
    const node = {
        type: "MATH_OPERATION",
        config: { operation: "divide", operand: 5 }
    };

    expectEqual(executeMathOperation(node, 10), 2);
});

test("Math division rejects zero operand", () => {
    const node = {
        type: "MATH_OPERATION",
        config: { operation: "divide", operand: 0 }
    };

    expectError(() => executeMathOperation(node, 10), "Division by zero");
});

test("Math operation rejects unsupported operation", () => {
    const node = {
        type: "MATH_OPERATION",
        config: { operation: "power", operand: 2 }
    };

    expectError(() => executeMathOperation(node, 10), "Unsupported math operation");
});

// ACTION TRIGGER TESTS
test("Action Trigger returns successful result", () => {
    const node = {
        type: "ACTION_TRIGGER",
        config: {
            action: "log",
            message: "Workflow completed"
        }
    };

    const result = executeActionTrigger(node, 50);

    expectEqual(result.triggered, true);
    expectEqual(result.data, 50);
    expectEqual(result.message, "Workflow completed");
});

test("Action Trigger rejects unsupported action", () => {
    const node = {
        type: "ACTION_TRIGGER",
        config: { action: "email" }
    };

    expectError(() => executeActionTrigger(node, 50), "Unsupported action");
});

// GENERAL NODE TEST
test("Execute Node handles Data Source", () => {
    const node = {
        type: "DATA_SOURCE",
        config: { value: 25 }
    };

    expectEqual(executeNode(node), 25);
});

test("Execute Node rejects unsupported node type", () => {
    const node = {
        type: "UNKNOWN",
        config: {}
    };

    expectError(() => executeNode(node), "Unsupported node type");
});

console.log("\n========== TEST SUMMARY ==========");
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log("==================================");

if (failed > 0) {
    process.exitCode = 1;
}
