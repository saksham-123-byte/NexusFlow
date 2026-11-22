# NexusFlow – Day 1 Workflow Graph Database Design

## Role
Backend Developer – Graph Persistence & RxJS Engine

## 1. Objective
Design a MongoDB document structure to persist complete workflow graphs, including workflow metadata, nodes, edges and node configurations.

## 2. Database Design

- Database: MongoDB Atlas
- Database name: `nexusflow`
- Collection name: `workflows`
- Collection type: Normal MongoDB collection
- MongoDB driver: Native Node.js MongoDB driver

The existing `telemetry` Time-Series collection will remain separate.

## 3. Workflow Document Structure

Each workflow document contains:

- name
- description
- version
- nodes
- edges
- createdAt
- updatedAt

## 4. Node Structure

Each node contains:

- id: Unique node identifier
- type: Node category
- position: Visual editor coordinates (x, y)
- config: Node-specific configuration

Initial node categories:

1. dataSource
2. mathOperation
3. actionTrigger

The node type field will remain extensible for future node categories.

## 5. Edge Structure

Each edge contains:

- id: Unique edge identifier
- source: Source node ID
- target: Target node ID
- sourceHandle: Optional source connection handle
- targetHandle: Optional target connection handle

Edges define the connections between workflow nodes.

## 6. Relationships

A workflow contains multiple nodes and edges.

Each edge references existing nodes through its source and target identifiers.

The design supports linear and branching workflow structures.

## 7. Validation Requirements

- Workflow name must be provided.
- Nodes and edges must be arrays.
- Node IDs must be unique within a workflow.
- Edge IDs must be unique within a workflow.
- Node types must be non-empty strings.
- Edge source and target must reference existing nodes.
- Node positions must contain valid numeric coordinates.
- Node configuration must be an object.

## 8. MongoDB Integration

The workflow collection will use the existing MongoDB connection module.

Database access will be obtained using the existing `getDB()` function.

Workflow persistence and retrieval service functions will be implemented on Day 2.

## 9. Future Integration

The workflow document is designed to support:

- Graph parsing.
- RxJS Observable pipelines.
- Data Source execution.
- Math Operation execution.
- Action Trigger execution.

## 10. Day 1 Outcome

Completed the initial MongoDB workflow graph schema design, including workflow metadata, node structure, edge relationships, validation requirements and database collection planning.