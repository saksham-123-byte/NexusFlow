
const parseWorkflowGraph = (workflow) => {
    if (!workflow || typeof workflow !== "object" || Array.isArray(workflow)) {
        throw new Error("Workflow must be a valid object");
    }

    const { nodes, edges } = workflow;

    if (!Array.isArray(nodes) || !Array.isArray(edges)) {
        throw new Error("Workflow nodes and edges must be arrays");
    }

    if (nodes.length === 0) {
        throw new Error("Workflow must contain at least one node");
    }

    const nodeMap = new Map();
    const incomingEdges = new Map();
    const outgoingEdges = new Map();
    const edgeIds = new Set();

    // Register and validate nodes
    nodes.forEach((node) => {
        if (
            !node ||
            typeof node !== "object" ||
            Array.isArray(node) ||
            typeof node.id !== "string" ||
            !node.id.trim()
        ) {
            throw new Error("Every workflow node must have a valid ID");
        }

        if (nodeMap.has(node.id)) {
            throw new Error(`Duplicate node ID: ${node.id}`);
        }

        nodeMap.set(node.id, node);
        incomingEdges.set(node.id, []);
        outgoingEdges.set(node.id, []);
    });

    // Validate and register edges
    edges.forEach((edge) => {
        if (!edge || typeof edge !== "object" || Array.isArray(edge)) {
            throw new Error("Every workflow edge must be a valid object");
        }

        if (typeof edge.id !== "string" || !edge.id.trim()) {
            throw new Error("Every workflow edge must have a valid ID");
        }

        if (edgeIds.has(edge.id)) {
            throw new Error(`Duplicate edge ID: ${edge.id}`);
        }

        if (!nodeMap.has(edge.source) || !nodeMap.has(edge.target)) {
            throw new Error(`Edge ${edge.id} references an unknown node`);
        }

        if (edge.source === edge.target) {
            throw new Error(`Edge ${edge.id} cannot connect a node to itself`);
        }

        edgeIds.add(edge.id);
        incomingEdges.get(edge.target).push(edge);
        outgoingEdges.get(edge.source).push(edge);
    });

    // Validate node connections
    nodes.forEach((node) => {
        const incoming = incomingEdges.get(node.id);

        if (node.type === "DATA_SOURCE") {
            if (incoming.length !== 0) {
                throw new Error(
                    `Data Source node ${node.id} cannot have incoming edges`
                );
            }
        } else if (incoming.length !== 1) {
            throw new Error(
                `Node ${node.id} must have exactly one incoming edge`
            );
        }
    });

    // Calculate incoming edge counts
    const inDegree = new Map();

    nodes.forEach((node) => {
        inDegree.set(node.id, incomingEdges.get(node.id).length);
    });

    // Find starting nodes
    const queue = nodes
        .filter((node) => inDegree.get(node.id) === 0)
        .map((node) => node.id);

    // Topological sorting using Kahn's algorithm
    const orderedNodes = [];

    while (queue.length > 0) {
        const currentId = queue.shift();
        const currentNode = nodeMap.get(currentId);

        orderedNodes.push({
            ...currentNode,
            inputNodeId:
                incomingEdges.get(currentId).length === 1
                    ? incomingEdges.get(currentId)[0].source
                    : null
        });

        outgoingEdges.get(currentId).forEach((edge) => {
            const targetId = edge.target;
            const remaining = inDegree.get(targetId) - 1;

            inDegree.set(targetId, remaining);

            if (remaining === 0) {
                queue.push(targetId);
            }
        });
    }

    // Detect cycles
    if (orderedNodes.length !== nodes.length) {
        throw new Error("Workflow graph contains a cycle");
    }

    return orderedNodes;
};

module.exports = {
    parseWorkflowGraph
};
