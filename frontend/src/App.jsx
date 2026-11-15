
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

// Initial workflow nodes
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

// Custom Sensor Node
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

// Custom Condition Node
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
          {data.sensor} {operators[data.operator] || '>'} {data.threshold}
          {data.unit}
        </small>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

// Custom Alert Node
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

const nodeTypes = {
  sensor: SensorNode,
  condition: ConditionNode,
  alert: AlertNode,
};

const nodeTemplates = [
  {
    type: 'sensor',
    label: 'Temperature Sensor',
    category: 'SENSOR',
    icon: '🌡️',
    data: { label: 'Temperature Sensor', sensor: 'Temperature', unit: '°C' },
  },
  {
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
  {
    type: 'alert',
    label: 'Send Alert',
    category: 'ACTION',
    icon: '🔔',
    data: {
      label: 'Send Alert',
      action: 'Send Alert',
      message: 'Temperature limit exceeded!',
    },
  },
];

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  const reactFlowInstance = useRef(null);
  const idCounter = useRef(4);

  const selectedNode = nodes.find((node) => node.id === selectedNodeId);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({
      ...params,
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed },
    }, eds)),
    [setEdges]
  );

  // Add a node to the canvas
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

    setNodes((currentNodes) => [...currentNodes, newNode]);
    setSelectedNodeId(id);
  };

  // Drag and drop support
  const onDragStart = (event, template) => {
    event.dataTransfer.setData('application/nexus-node', template.type);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const onDrop = (event) => {
    event.preventDefault();

    const type = event.dataTransfer.getData('application/nexus-node');
    const template = nodeTemplates.find((item) => item.type === type);

    if (!template || !reactFlowInstance.current) return;

    const position = reactFlowInstance.current.screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    addNode(template, position);
  };

  // Update selected node properties
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

  const clearCanvas = () => {
    setNodes([]);
    setEdges([]);
    setSelectedNodeId(null);
  };

  return (
    <div className="app-container">
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
        <aside className="sidebar">
          <div className="sidebar-heading">
            <h2>NODE LIBRARY</h2>
            <p>Drag nodes onto your canvas</p>
          </div>

          {['SENSOR', 'LOGIC', 'ACTION'].map((category) => (
            <div className="node-category" key={category}>
              <h3>{category}</h3>

              {nodeTemplates
                .filter((template) => template.category === category)
                .map((template) => (
                  <div
                    key={template.type}
                    className="library-node"
                    draggable
                    onDragStart={(event) => onDragStart(event, template)}
                    onClick={() => addNode(template)}
                  >
                    <span className="library-icon">{template.icon}</span>
                    <span>{template.label}</span>
                    <span className="add-symbol">+</span>
                  </div>
                ))}
            </div>
          ))}

          <button className="clear-button" onClick={clearCanvas}>
            Clear Canvas
          </button>
        </aside>

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
              onNodeClick={(_, node) => setSelectedNodeId(node.id)}
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
            <span>Select a node to edit its properties</span>
          </div>
        </section>

        {selectedNode && (
          <aside className="properties-panel">
            <div className="properties-header">
              <div>
                <span className="properties-eyebrow">CONFIGURATION</span>
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

            <div className="selected-node-info">
              <span className="selected-node-icon">
                {selectedNode.type === 'sensor'
                  ? '🌡️'
                  : selectedNode.type === 'condition'
                    ? '⚙️'
                    : '🔔'}
              </span>
              <div>
                <strong>{selectedNode.data.label}</strong>
                <small>{selectedNode.type.toUpperCase()} NODE</small>
              </div>
            </div>

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

            {selectedNode.type === 'condition' && (
              <>
                <div className="property-divider"></div>
                <h3 className="property-section-title">CONDITION SETTINGS</h3>

                <div className="property-field">
                  <label>Sensor Field</label>
                  <select
                    value={selectedNode.data.sensor || 'Temperature'}
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
                    value={selectedNode.data.operator || 'greater_than'}
                    onChange={(event) =>
                      updateNodeData('operator', event.target.value)
                    }
                  >
                    <option value="greater_than">Greater Than (&gt;)</option>
                    <option value="less_than">Less Than (&lt;)</option>
                    <option value="equal_to">Equal To (=)</option>
                    <option value="greater_equal">Greater or Equal (≥)</option>
                    <option value="less_equal">Less or Equal (≤)</option>
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

            {selectedNode.type === 'sensor' && (
              <div className="property-field">
                <label>Sensor Type</label>
                <select
                  value={selectedNode.data.sensor || 'Temperature'}
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

            {selectedNode.type === 'alert' && (
              <>
                <div className="property-field">
                  <label>Action</label>
                  <select
                    value={selectedNode.data.action || 'Send Alert'}
                    onChange={(event) =>
                      updateNodeData('action', event.target.value)
                    }
                  >
                    <option value="Send Alert">Send Alert</option>
                    <option value="Email Notification">Email Notification</option>
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
