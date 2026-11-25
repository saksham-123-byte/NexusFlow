
const validateNode = (node) => {
    if (!node || typeof node !== "object" || Array.isArray(node)) {
        throw new Error("Workflow node must be a valid object");
    }

    if (
        !node.config ||
        typeof node.config !== "object" ||
        Array.isArray(node.config)
    ) {
        throw new Error("Node config must be a valid object");
    }
};

// Execute DATA_SOURCE node
const executeDataSource = (node) => {
    validateNode(node);

    const { value } = node.config;

    if (typeof value !== "number" || !Number.isFinite(value)) {
        throw new Error("Data Source value must be a finite number");
    }

    return value;
};

// Execute MATH_OPERATION node
const executeMathOperation = (node, inputData) => {
    validateNode(node);

    if (typeof inputData !== "number" || !Number.isFinite(inputData)) {
        throw new Error("Math operation input must be a finite number");
    }

    const { operation, operand } = node.config;

    if (typeof operand !== "number" || !Number.isFinite(operand)) {
        throw new Error("Math operation operand must be a finite number");
    }

    switch (operation) {
        case "add":
            return inputData + operand;

        case "subtract":
            return inputData - operand;

        case "multiply":
            return inputData * operand;

        case "divide":
            if (operand === 0) {
                throw new Error("Division by zero is not allowed");
            }
            return inputData / operand;

        default:
            throw new Error(`Unsupported math operation: ${operation}`);
    }
};

// Execute ACTION_TRIGGER node
const executeActionTrigger = (node, inputData) => {
    validateNode(node);

    const { action, message = "" } = node.config;

    if (action !== "log") {
        throw new Error(`Unsupported action trigger: ${action}`);
    }

    if (typeof message !== "string") {
        throw new Error("Action message must be a string");
    }

    const result = {
        triggered: true,
        action,
        message,
        data: inputData
    };

    console.log("Workflow action triggered:", result);

    return result;
};

// Execute a workflow node based on its type
const executeNode = (node, inputData) => {
    validateNode(node);

    switch (node.type) {
        case "DATA_SOURCE":
            return executeDataSource(node);

        case "MATH_OPERATION":
            return executeMathOperation(node, inputData);

        case "ACTION_TRIGGER":
            return executeActionTrigger(node, inputData);

        default:
            throw new Error(`Unsupported node type: ${node.type}`);
    }
};

module.exports = {
    executeDataSource,
    executeMathOperation,
    executeActionTrigger,
    executeNode
};
