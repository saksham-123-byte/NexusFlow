
const createWorkflowDocument = (data) => {
    // Validate the main workflow input
    if (!data || typeof data !== "object" || Array.isArray(data)) {
        throw new Error("Workflow data must be a valid object");
    }

    const {
        name,
        description = "",
        version = 1,
        nodes = [],
        edges = []
    } = data;

    // Validate workflow name
    if (typeof name !== "string" || !name.trim()) {
        throw new Error("Workflow name is required");
    }

    // Validate description
    if (typeof description !== "string") {
        throw new Error("Workflow description must be a string");
    }

    // Validate version
    if (!Number.isInteger(version) || version < 1) {
        throw new Error("Workflow version must be a positive integer");
    }

    // Validate nodes and edges arrays
    if (!Array.isArray(nodes) || !Array.isArray(edges)) {
        throw new Error("Workflow nodes and edges must be arrays");
    }

    const nodeIds = new Set();

    // Validate and prepare nodes
    const validatedNodes = nodes.map((node) => {
        if (!node || typeof node !== "object" || Array.isArray(node)) {
            throw new Error("Each workflow node must be a valid object");
        }

        if (typeof node.id !== "string" || !node.id.trim()) {
            throw new Error("Every node must have a valid ID");
        }

        if (nodeIds.has(node.id)) {
            throw new Error(`Duplicate node ID: ${node.id}`);
        }

        if (typeof node.type !== "string" || !node.type.trim()) {
            throw new Error(`Node ${node.id} must have a valid type`);
        }

        if (
            !node.position ||
            typeof node.position !== "object" ||
            Array.isArray(node.position) ||
            !Number.isFinite(node.position.x) ||
            !Number.isFinite(node.position.y)
        ) {
            throw new Error(`Node ${node.id} must have valid x and y positions`);
        }

        if (
            !node.config ||
            typeof node.config !== "object" ||
            Array.isArray(node.config)
        ) {
            throw new Error(`Node ${node.id} must have a valid config object`);
        }

        nodeIds.add(node.id);

        return {
            id: node.id,
            type: node.type.trim(),
            position: {
                x: node.position.x,
                y: node.position.y
            },
            config: node.config
        };
    });

    const edgeIds = new Set();

    // Validate and prepare edges
    const validatedEdges = edges.map((edge) => {
        if (!edge || typeof edge !== "object" || Array.isArray(edge)) {
            throw new Error("Each workflow edge must be a valid object");
        }

        if (typeof edge.id !== "string" || !edge.id.trim()) {
            throw new Error("Every edge must have a valid ID");
        }

        if (edgeIds.has(edge.id)) {
            throw new Error(`Duplicate edge ID: ${edge.id}`);
        }

        if (
            typeof edge.source !== "string" ||
            !nodeIds.has(edge.source)
        ) {
            throw new Error(`Edge ${edge.id} has an invalid source node`);
        }

        if (
            typeof edge.target !== "string" ||
            !nodeIds.has(edge.target)
        ) {
            throw new Error(`Edge ${edge.id} has an invalid target node`);
        }

        if (
            edge.sourceHandle !== undefined &&
            typeof edge.sourceHandle !== "string"
        ) {
            throw new Error(`Edge ${edge.id} has an invalid sourceHandle`);
        }

        if (
            edge.targetHandle !== undefined &&
            typeof edge.targetHandle !== "string"
        ) {
            throw new Error(`Edge ${edge.id} has an invalid targetHandle`);
        }

        edgeIds.add(edge.id);

        return {
            id: edge.id,
            source: edge.source,
            target: edge.target,
            ...(edge.sourceHandle !== undefined && {
                sourceHandle: edge.sourceHandle
            }),
            ...(edge.targetHandle !== undefined && {
                targetHandle: edge.targetHandle
            })
        };
    });

    // Create the final MongoDB workflow document
    const now = new Date();

    return {
        name: name.trim(),
        description: description.trim(),
        version,
        nodes: validatedNodes,
        edges: validatedEdges,
        createdAt: now,
        updatedAt: now
    };
};

module.exports = {
    createWorkflowDocument
};
