# NexusFlow – Dynamic IoT Rule Engine

A visual workflow builder designed to make IoT rule creation easier through a drag-and-drop interface.

## 1. Project Overview

NexusFlow is a frontend prototype of a Dynamic IoT Rule Engine.

Traditional IoT applications often require developers to modify application code whenever business rules change.

NexusFlow aims to simplify this process by allowing users to create workflows visually using configurable nodes.

Users can connect data sources, apply logical and mathematical operations, and configure action triggers through a visual canvas.

## 2. Problem Statement

Hardcoding IoT device logic, such as sending an alert when temperature exceeds 80°C, requires developer intervention whenever a rule changes.

Traditional application architectures can also face challenges when handling high-frequency machine data and dynamically defined rules.

NexusFlow explores a visual approach to configuring these rules without manually writing application logic for every change.

## 3. Current Features

- Interactive workflow canvas.
- Drag-and-drop node creation.
- Click-to-add node functionality.
- Custom React Flow nodes.
- Configurable node properties.
- Connection validation between node types.
- Duplicate connection prevention.
- Animated workflow connections.
- Workflow node and edge statistics.
- MiniMap and canvas controls.
- Node deletion support.
- Workflow save functionality.
- Workflow load functionality.
- Browser-based workflow persistence using localStorage.
- Save status feedback.
- Responsive dark-themed interface.

## 4. Technology Stack

### Frontend

- React
- Vite
- JavaScript
- CSS

### Workflow Visualization

- React Flow
- @xyflow/react

### Browser Storage

- localStorage

## 5. Node Library

NexusFlow currently provides the following node categories.

### Data Sources

- Temperature Sensor
- MQTT Data Source
- API Data Source

### Logic

- Condition

### Math Operations

- Addition
- Subtraction
- Multiplication
- Division
- Average

### Action Triggers

- Send Alert
- Email Notification
- Webhook

## 6. Workflow Structure

A workflow consists of nodes and connections.

Each node represents a specific operation or component in the workflow.

Connections define the visual sequence between workflow components.

Example workflow:

Temperature Sensor → Temperature Condition → Send Alert

Example rule:

If temperature is greater than 80°C, configure an alert action.

## 7. Connection Rules

The editor validates connections based on node types.

- Sensor nodes can connect to math or condition nodes.
- Data source nodes can connect to math or condition nodes.
- Math nodes can connect to math or condition nodes.
- Condition nodes can connect to alert or action trigger nodes.
- Alert nodes cannot be used as source nodes.
- Action trigger nodes cannot be used as source nodes.
- Self-connections are rejected.
- Duplicate connections are rejected.

## 8. Node Configuration and Validation

Users can configure individual nodes through the properties panel.

Examples of configuration validation include:

- MQTT endpoint format validation.
- REST API endpoint format validation.
- Condition operator validation.
- Numeric threshold validation.
- Email recipient validation.
- Webhook URL validation.
- Required alert message validation.

These checks validate configuration formats and do not establish live external connections.

## 9. Workflow Save and Load

NexusFlow supports saving and restoring workflows through browser localStorage.

The Save Workflow button stores the current nodes and connections.

The Load Workflow button restores the previously saved workflow.

The application also attempts to restore the last saved workflow when the page is refreshed.

Saved workflows are stored locally in the browser.

Clearing browser storage may remove saved workflows.

## 10. Installation and Setup

### Prerequisites

- Node.js
- npm
- Git
- Visual Studio Code (recommended)

### Clone Repository

```bash
git clone https://github.com/saksham-123-byte/NexusFlow.git
```

### Navigate to Frontend

```bash
cd NexusFlow/frontend
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

Open the local URL displayed in the terminal, usually:

```text
http://localhost:5173/
```

## 11. Project Structure

```text
NexusFlow/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## 12. Current Project Scope

The current implementation focuses on the frontend workflow editor.

The following capabilities are not yet implemented:

- Live MQTT broker communication.
- Live REST API data ingestion.
- Backend rule execution engine.
- Real-time IoT sensor streaming.
- Database integration.
- Actual email delivery.
- Actual webhook execution.
- User authentication.

Node configuration and connection validation currently operate within the frontend prototype.

## 13. Future Enhancements

Planned improvements include:

- Workflow JSON export.
- Workflow JSON import.
- Node duplication.
- Improved node and edge management.
- Undo and redo functionality.
- Node library search.
- Workflow validation summary.
- Workflow simulation mode.
- Backend integration.
- Real-time IoT data processing.
- Dynamic rule execution.

## 14. Development Status

NexusFlow is under active development as an internship project.

The current milestone focuses on building the visual workflow editor and expanding its node library.

Future milestones will progressively introduce workflow management, validation, simulation, and backend capabilities.

## 15. Author

**Project:** NexusFlow – Dynamic IoT Rule Engine

**Repository:** https://github.com/saksham-123-byte/NexusFlow

**Development:** Internship Project

---

*Built to make dynamic IoT rule configuration more visual, flexible, and accessible.*
## 16. Application Preview

NexusFlow provides a visual workflow editor where users can create and configure IoT automation workflows.

### Default Workflow

The application starts with a sample workflow:

**Temperature Sensor → Temperature Condition → Send Alert**

Example configuration:

- Data source: Temperature Sensor
- Condition: Temperature greater than 80°C
- Action: Send Alert

### How to Use the Editor

1. Open the NexusFlow application.
2. Select a node from the sidebar.
3. Add the node to the workflow canvas using drag-and-drop or click.
4. Select a node to configure its properties.
5. Connect compatible nodes using their connection handles.
6. Review node configuration and validation messages.
7. Click Save Workflow to store the current workflow.
8. Use Load Workflow to restore the saved workflow.

### Workflow Management

The editor provides a visual environment for managing workflow nodes and connections.

Users can configure individual nodes, inspect workflow connections, and save their workflow for later use.

### Project Note

This application is currently a frontend prototype. Workflow connections represent visual logic and do not yet execute real IoT operations or trigger external services.
## 17. Design Principles and Reliability

NexusFlow follows a modular approach to make workflow creation easier to understand and maintain.

### User Experience

- Simple and intuitive workflow editor.
- Clear separation between node categories.
- Consistent dark-themed interface.
- Easy access to node configuration.
- Immediate visual feedback for invalid configurations.

### Workflow Reliability

- Prevents unsupported node connections.
- Rejects duplicate connections.
- Preserves node configurations when saving workflows.
- Restores saved nodes and edges from browser storage.
- Handles invalid or unavailable saved workflow data.
- Maintains unique node IDs when adding new nodes.

### Maintainability

- Custom node components keep node interfaces organized.
- Reusable connection validation logic.
- Separate styling through CSS.
- Versioned workflow storage structure.
- React state management for interactive canvas updates.

### Development Goal

The long-term goal is to evolve NexusFlow into a complete dynamic IoT rule engine that can process incoming sensor data and execute user-defined automation rules without requiring code changes for every new business requirement.