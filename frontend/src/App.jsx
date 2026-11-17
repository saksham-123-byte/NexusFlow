
import { useCallback, useRef, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  addEdge,
  useNodesState,
  useEdgesState,
  MarkerType,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import './App.css';

// ==========================================
// WEEK 1: INITIAL WORKFLOW
// ==========================================

const initialNodes = [
  {
    id: '1',
    type: 'sensor',
    position: { x: 100, y: 130 },
    data: {
      label: 'Temperature Sensor',
      sensor: 'Temperature',
      unit: '°C',
    },
  },
  {
    id: '2',
    type: 'condition',
    position: { x: 400, y: 130 },
    data: {
      label: 'Temperature Condition',
      sensor: 'Temperature',
      operator: 'greater_than',
      threshold: 80,
      unit: '°C',
    },
  },
  {
    id: '3',
    type: 'alert',
    position: { x: 700, y: 130 },
    data: {
      label: 'Send Alert',
      action: 'Send Alert',
      message: 'Temperature limit exceeded!',
    },
  },
];

const initialEdges = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
  },
];

// ==========================================
// WEEK 1: ORIGINAL CUSTOM NODES
// ==========================================

function SensorNode({ data }) {
  return (
    <div className="node-card sensor-node">
      <Handle type="source" position={Position.Bottom} />
      <div className="node-icon">🌡️</div>
      <div className="node-content">
        <strong>{data.label}</strong>
        <span>Sensor Input</span>
        <small>{data.sensor} ({data.unit})</small>
      </div>
    </div>
  );
}

function ConditionNode({ data }) {
  const operators = {
    greater_than: '>',
    less_than: '<',
    equal_to: '=',
    greater_equal: '≥',
    less_equal: '≤',
  };

  return (
    <div className="node-card condition-node">
      <Handle type="target" position={Position.Top} />
      <div className="node-icon">⚙️</div>
      <div className="node-content">
        <strong>{data.label}</strong>
        <span>Condition</span>
        <small>
          {data.sensor} {operators[data.operator] || '>'}{' '}
          {data.threshold}{data.unit}
        </small>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

function AlertNode({ data }) {
  return (
    <div className="node-card alert-node">
      <Handle type="target" position={Position.Top} />
      <div className="node-icon">🔔</div>
      <div className="node-content">
        <strong>{data.label}</strong>
        <span>Action</span>
        <small>{data.action}</small>
      </div>
    </div>
  );
}

// ==========================================
// WEEK 2: DATA SOURCE NODE
// ==========================================

function DataSourceNode({ data }) {
  return (
    <div className="node-card sensor-node">
      <Handle type="source" position={Position.Bottom} />
      <div className="node-icon">📡</div>
      <div className="node-content">
        <strong>{data.label}</strong>
        <span>Data Source</span>
        <small>{data.sourceType || 'IoT Input'}</small>
      </div>
    </div>
  );
}

// ==========================================
// WEEK 2: MATH OPERATION NODE
// ==========================================

function MathOperationNode({ data }) {
  return (
    <div className="node-card condition-node">
      <Handle type="target" position={Position.Top} />
      <div className="node-icon">🧮</div>
      <div className="node-content">
        <strong>{data.label}</strong>
        <span>Math Operation</span>
        <small>{data.operation || 'Add'}</small>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

// ==========================================
// WEEK 2: ACTION TRIGGER NODE
// ==========================================

function ActionTriggerNode({ data }) {
  return (
    <div className="node-card alert-node">
      <Handle type="target" position={Position.Top} />
      <div className="node-icon">⚡</div>
      <div className="node-content">
        <strong>{data.label}</strong>
        <span>Action Trigger</span>
        <small>{data.action || 'Webhook'}</small>
      </div>
    </div>
  );
}

// ==========================================
// REGISTER ALL CUSTOM NODE TYPES
// ==========================================

const nodeTypes = {
  sensor: SensorNode,
  condition: ConditionNode,
  alert: AlertNode,
  dataSource: DataSourceNode,
  mathOperation: MathOperationNode,
  actionTrigger: ActionTriggerNode,
};

// ==========================================
// NODE LIBRARY TEMPLATES
// ==========================================

const nodeTemplates = [
  // DATA SOURCES
  {
    id: 'temperature-sensor',
    type: 'sensor',
    label: 'Temperature Sensor',
    category: 'DATA SOURCES',
    icon: '🌡️',
    data: {
      label: 'Temperature Sensor',
      sensor: 'Temperature',
      unit: '°C',
    },
  },
  {
    id: 'mqtt-source',
    type: 'dataSource',
    label: 'MQTT Data Source',
    category: 'DATA SOURCES',
    icon: '📡',
    data: {
      label: 'MQTT Data Source',
      sourceType: 'MQTT',
    },
  },
  {
    id: 'api-source',
    type: 'dataSource',
    label: 'API Data Source',
    category: 'DATA SOURCES',
    icon: '🔌',
    data: {
      label: 'API Data Source',
      sourceType: 'REST API',
    },
  },

  // LOGIC
  {
    id: 'condition',
    type: 'condition',
    label: 'Condition',
    category: 'LOGIC',
    icon: '⚙️',
    data: {
      label: 'New Condition',
      sensor: 'Temperature',
      operator: 'greater_than',
      threshold: 80,
      unit: '°C',
    },
  },

  // MATH OPERATIONS
  {
    id: 'addition',
    type: 'mathOperation',
    label: 'Addition',
    category: 'MATH OPERATIONS',
    icon: '➕',
    data: {
      label: 'Addition',
      operation: 'Add',
    },
  },
  {
    id: 'multiplication',
    type: 'mathOperation',
    label: 'Multiplication',
    category: 'MATH OPERATIONS',
    icon: '✖️',
    data: {
      label: 'Multiplication',
      operation: 'Multiply',
    },
  },
  {
    id: 'average',
    type: 'mathOperation',
    label: 'Average',
    category: 'MATH OPERATIONS',
    icon: '📊',
    data: {
      label: 'Average',
      operation: 'Average',
    },
  },

  // ACTION TRIGGERS
  {
    id: 'send-alert',
    type: 'alert',
    label: 'Send Alert',
    category: 'ACTION TRIGGERS',
    icon: '🔔',
    data: {
      label: 'Send Alert',
      action: 'Send Alert',
      message: 'Temperature limit exceeded!',
    },
  },
  {
    id: 'email-notification',
    type: 'actionTrigger',
    label: 'Email Notification',
    category: 'ACTION TRIGGERS',
    icon: '📧',
    data: {
      label: 'Email Notification',
      action: 'Email',
    },
  },
  {
    id: 'webhook',
    type: 'actionTrigger',
    label: 'Webhook',
    category: 'ACTION TRIGGERS',
    icon: '⚡',
    data: {
      label: 'Webhook Trigger',
      action: 'Webhook',
    },
  },
];

// ==========================================
// MAIN APP COMPONENT
// ==========================================

function App() {
  const [nodes, setNodes, onNodesChange] =
    useNodesState(initialNodes);

  const [edges, setEdges, onEdgesChange] =
    useEdgesState(initialEdges);

  const [selectedNodeId, setSelectedNodeId] = useState(null);

  const reactFlowInstance = useRef(null);
  const idCounter = useRef(4);

  const selectedNode = nodes.find(
    (node) => node.id === selectedNodeId
  );

  // CONNECT NODES
  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            animated: true,
            markerEnd: { type: MarkerType.ArrowClosed },
          },
          eds
        )
      ),
    [setEdges]
  );

  // ADD NODE TO CANVAS
  const addNode = (template, position) => {
    const id = String(idCounter.current++);

    const newNode = {
      id,
      type: template.type,
      position: position || {
        x: 150 + nodes.length * 35,
        y: 100 + nodes.length * 35,
      },
      data: { ...template.data },
    };

    setNodes((currentNodes) => [
      ...currentNodes,
      newNode,
    ]);

    setSelectedNodeId(id);
  };

  // DRAG START
  const onDragStart = (event, template) => {
    event.dataTransfer.setData(
      'application/nexus-node',
      template.id
    );

    event.dataTransfer.effectAllowed = 'move';
  };

  // DRAG OVER CANVAS
  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  // DROP NODE ON CANVAS
  const onDrop = (event) => {
    event.preventDefault();

    const templateId = event.dataTransfer.getData(
      'application/nexus-node'
    );

    const template = nodeTemplates.find(
      (item) => item.id === templateId
    );

    if (!template || !reactFlowInstance.current) return;

    const position =
      reactFlowInstance.current.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

    addNode(template, position);
  };

  // UPDATE SELECTED NODE PROPERTIES
  const updateNodeData = (field, value) => {
    setNodes((currentNodes) =>
      currentNodes.map((node) =>
        node.id === selectedNodeId
          ? {
              ...node,
              data: {
                ...node.data,
                [field]: value,
              },
            }
          : node
      )
    );
  };

  // CLEAR CANVAS
  const clearCanvas = () => {
    setNodes([]);
    setEdges([]);
    setSelectedNodeId(null);
  };

  // GET SELECTED NODE ICON
  const getNodeIcon = (type) => {
    const icons = {
      sensor: '🌡️',
      condition: '⚙️',
      alert: '🔔',
      dataSource: '📡',
      mathOperation: '🧮',
      actionTrigger: '⚡',
    };

    return icons[type] || '✦';
  };

  // ==========================================
  // APP UI
  // ==========================================

  return (
    <div className="app-container">

      {/* HEADER */}
      <header className="app-header">
        <div className="brand">
          <span className="brand-icon">✦</span>
          <div>
            <h1>NEXUS FLOW</h1>
            <p>Dynamic IoT Rule Engine</p>
          </div>
        </div>

        <div className="header-status">
          <span className="status-dot"></span>
          Workflow Editor
        </div>
      </header>

      <main className="workspace">

        {/* ==================================
            NODE LIBRARY SIDEBAR
        ================================== */}

        <aside className="sidebar">
          <div className="sidebar-heading">
            <h2>NODE LIBRARY</h2>
            <p>Drag nodes onto your canvas</p>
          </div>

          {[
            'DATA SOURCES',
            'LOGIC',
            'MATH OPERATIONS',
            'ACTION TRIGGERS',
          ].map((category) => (
            <div className="node-category" key={category}>
              <h3>{category}</h3>

              {nodeTemplates
                .filter(
                  (template) => template.category === category
                )
                .map((template) => (
                  <div
                    key={template.id}
                    className="library-node"
                    draggable
                    onDragStart={(event) =>
                      onDragStart(event, template)
                    }
                    onClick={() => addNode(template)}
                  >
                    <span className="library-icon">
                      {template.icon}
                    </span>

                    <span>{template.label}</span>

                    <span className="add-symbol">+</span>
                  </div>
                ))}
            </div>
          ))}

          <button
            className="clear-button"
            onClick={clearCanvas}
          >
            Clear Canvas
          </button>
        </aside>

        {/* ==================================
            WORKFLOW CANVAS
        ================================== */}

        <section className="canvas-section">
          <div className="canvas-toolbar">
            <div>
              <h2>Workflow Canvas</h2>
              <p>Design your IoT automation visually</p>
            </div>

            <div className="canvas-stats">
              <span>{nodes.length} Nodes</span>
              <span>{edges.length} Connections</span>
            </div>
          </div>

          <div className="flow-wrapper">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              onInit={(instance) => {
                reactFlowInstance.current = instance;
              }}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={(_, node) =>
                setSelectedNodeId(node.id)
              }
              onPaneClick={() => setSelectedNodeId(null)}
              onDragOver={onDragOver}
              onDrop={onDrop}
              fitView
              deleteKeyCode={['Backspace', 'Delete']}
            >
              <Background color="#34364d" gap={20} />
              <Controls />
              <MiniMap nodeStrokeWidth={3} zoomable pannable />
            </ReactFlow>
          </div>

          <div className="canvas-footer">
            <span>● Editor Ready</span>
            <span>
              Select a node to edit its properties
            </span>
          </div>
        </section>

        {/* ==================================
            PROPERTIES PANEL
        ================================== */}

        {selectedNode && (
          <aside className="properties-panel">

            <div className="properties-header">
              <div>
                <span className="properties-eyebrow">
                  CONFIGURATION
                </span>
                <h2>Node Properties</h2>
              </div>

              <button
                className="close-panel"
                onClick={() => setSelectedNodeId(null)}
                title="Close panel"
              >
                ×
              </button>
            </div>

            {/* SELECTED NODE INFO */}

            <div className="selected-node-info">
              <span className="selected-node-icon">
                {getNodeIcon(selectedNode.type)}
              </span>

              <div>
                <strong>{selectedNode.data.label}</strong>
                <small>
                  {selectedNode.type.toUpperCase()} NODE
                </small>
              </div>
            </div>

            {/* COMMON NODE NAME */}

            <div className="property-field">
              <label>Node Name</label>
              <input
                type="text"
                value={selectedNode.data.label || ''}
                onChange={(event) =>
                  updateNodeData('label', event.target.value)
                }
              />
            </div>

            {/* WEEK 1: CONDITION SETTINGS */}

            {selectedNode.type === 'condition' && (
              <>
                <div className="property-divider"></div>

                <h3 className="property-section-title">
                  CONDITION SETTINGS
                </h3>

                <div className="property-field">
                  <label>Sensor Field</label>

                  <select
                    value={
                      selectedNode.data.sensor || 'Temperature'
                    }
                    onChange={(event) =>
                      updateNodeData('sensor', event.target.value)
                    }
                  >
                    <option value="Temperature">Temperature</option>
                    <option value="Humidity">Humidity</option>
                    <option value="Pressure">Pressure</option>
                  </select>
                </div>

                <div className="property-field">
                  <label>Operator</label>

                  <select
                    value={
                      selectedNode.data.operator || 'greater_than'
                    }
                    onChange={(event) =>
                      updateNodeData('operator', event.target.value)
                    }
                  >
                    <option value="greater_than">
                      Greater Than (&gt;)
                    </option>
                    <option value="less_than">
                      Less Than (&lt;)
                    </option>
                    <option value="equal_to">
                      Equal To (=)
                    </option>
                    <option value="greater_equal">
                      Greater or Equal (≥)
                    </option>
                    <option value="less_equal">
                      Less or Equal (≤)
                    </option>
                  </select>
                </div>

                <div className="property-field">
                  <label>Threshold Value</label>

                  <input
                    type="number"
                    value={selectedNode.data.threshold ?? 80}
                    onChange={(event) =>
                      updateNodeData(
                        'threshold',
                        event.target.value === ''
                          ? ''
                          : Number(event.target.value)
                      )
                    }
                  />
                </div>

                <div className="property-field">
                  <label>Unit</label>

                  <select
                    value={selectedNode.data.unit || '°C'}
                    onChange={(event) =>
                      updateNodeData('unit', event.target.value)
                    }
                  >
                    <option value="°C">Celsius (°C)</option>
                    <option value="%">Percent (%)</option>
                    <option value="bar">Bar</option>
                  </select>
                </div>
              </>
            )}

            {/* WEEK 1: SENSOR SETTINGS */}

            {selectedNode.type === 'sensor' && (
              <div className="property-field">
                <label>Sensor Type</label>

                <select
                  value={
                    selectedNode.data.sensor || 'Temperature'
                  }
                  onChange={(event) =>
                    updateNodeData('sensor', event.target.value)
                  }
                >
                  <option value="Temperature">Temperature</option>
                  <option value="Humidity">Humidity</option>
                  <option value="Pressure">Pressure</option>
                </select>
              </div>
            )}

            {/* WEEK 2: DATA SOURCE SETTINGS */}

            {selectedNode.type === 'dataSource' && (
              <>
                <div className="property-divider"></div>

                <h3 className="property-section-title">
                  DATA SOURCE SETTINGS
                </h3>

                <div className="property-field">
                  <label>Source Type</label>

                  <select
                    value={
                      selectedNode.data.sourceType || 'MQTT'
                    }
                    onChange={(event) =>
                      updateNodeData(
                        'sourceType',
                        event.target.value
                      )
                    }
                  >
                    <option value="MQTT">MQTT</option>
                    <option value="REST API">REST API</option>
                  </select>
                </div>
              </>
            )}

            {/* WEEK 2: MATH OPERATION SETTINGS */}

            {selectedNode.type === 'mathOperation' && (
              <>
                <div className="property-divider"></div>

                <h3 className="property-section-title">
                  MATH OPERATION SETTINGS
                </h3>

                <div className="property-field">
                  <label>Operation</label>

                  <select
                    value={
                      selectedNode.data.operation || 'Add'
                    }
                    onChange={(event) =>
                      updateNodeData(
                        'operation',
                        event.target.value
                      )
                    }
                  >
                    <option value="Add">Addition (+)</option>
                    <option value="Subtract">Subtraction (-)</option>
                    <option value="Multiply">Multiplication (×)</option>
                    <option value="Divide">Division (÷)</option>
                    <option value="Average">Average</option>
                  </select>
                </div>
              </>
            )}

            {/* WEEK 1: ALERT SETTINGS */}

            {selectedNode.type === 'alert' && (
              <>
                <div className="property-divider"></div>

                <h3 className="property-section-title">
                  ALERT SETTINGS
                </h3>

                <div className="property-field">
                  <label>Action</label>

                  <select
                    value={
                      selectedNode.data.action || 'Send Alert'
                    }
                    onChange={(event) =>
                      updateNodeData('action', event.target.value)
                    }
                  >
                    <option value="Send Alert">Send Alert</option>
                    <option value="Email Notification">
                      Email Notification
                    </option>
                    <option value="Log Event">Log Event</option>
                  </select>
                </div>

                <div className="property-field">
                  <label>Alert Message</label>

                  <textarea
                    rows="4"
                    value={selectedNode.data.message || ''}
                    onChange={(event) =>
                      updateNodeData('message', event.target.value)
                    }
                  />
                </div>
              </>
            )}

            {/* WEEK 2: ACTION TRIGGER SETTINGS */}

            {selectedNode.type === 'actionTrigger' && (
              <>
                <div className="property-divider"></div>

                <h3 className="property-section-title">
                  ACTION TRIGGER SETTINGS
                </h3>

                <div className="property-field">
                  <label>Action Type</label>

                  <select
                    value={
                      selectedNode.data.action || 'Webhook'
                    }
                    onChange={(event) =>
                      updateNodeData('action', event.target.value)
                    }
                  >
                    <option value="Email">Email</option>
                    <option value="Webhook">Webhook</option>
                  </select>
                </div>
              </>
            )}

            <div className="properties-note">
              <span>ⓘ</span>
              Changes are reflected immediately on the canvas.
            </div>

          </aside>
        )}

      </main>
    </div>
  );
}

export default App;
