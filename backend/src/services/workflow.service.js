
const { ObjectId } = require("mongodb");

const { getDB } = require("../config/database");

const {
    createWorkflowDocument
} = require("../models/workflow.model");

// Save a new workflow in MongoDB
const saveWorkflow = async (data) => {
    try {
        const workflowDocument = createWorkflowDocument(data);

        const db = getDB();

        const result = await db
            .collection("workflows")
            .insertOne(workflowDocument);

        return {
            insertedId: result.insertedId,
            data: {
                ...workflowDocument,
                _id: result.insertedId
            }
        };
    } catch (error) {
        console.error("Workflow save error:", error.message);
        throw error;
    }
};

// Retrieve one workflow using its MongoDB ID
const getWorkflowById = async (id) => {
    try {
        if (typeof id !== "string" || !ObjectId.isValid(id)) {
            throw new Error("Invalid workflow ID");
        }

        const db = getDB();

        const workflow = await db
            .collection("workflows")
            .findOne({ _id: new ObjectId(id) });

        return workflow;
    } catch (error) {
        console.error("Workflow retrieval error:", error.message);
        throw error;
    }
};

// Retrieve multiple workflows
const getAllWorkflows = async (limit = 100) => {
    try {
        if (
            !Number.isInteger(limit) ||
            limit < 1 ||
            limit > 1000
        ) {
            throw new Error("Limit must be an integer between 1 and 1000");
        }

        const db = getDB();

        const workflows = await db
            .collection("workflows")
            .find({})
            .sort({ updatedAt: -1 })
            .limit(limit)
            .toArray();

        return {
            count: workflows.length,
            data: workflows
        };
    } catch (error) {
        console.error("Workflow list retrieval error:", error.message);
        throw error;
    }
};

module.exports = {
    saveWorkflow,
    getWorkflowById,
    getAllWorkflows
};
