
import { useCallback, useRef } from 'react';

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
// 1. SENSOR NODE
// ==========================================

function SensorNode({ data }) {
  return (
    <div className="custom-node sensor-node">
      <Handle type="source" position={Position.Bottom} />

      <div className="node-heading">
        <span className="node-icon">◉</span>
        <span>SENSOR</span>
      </div>

      <h3>{data.label}</h3>
      <p>{data.description}</p>

      <div className="node-footer">
        IoT Data Source
      </div>
    </div>
  );
}

// ==========================================
// 2. CONDITION NODE
// ==========================================

function ConditionNode({ data }) {
  return (
    <div className="custom-node condition-node">
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />

      <div className="node-heading">
        <span className="node-icon">◇</span>
        <span>CONDITION</span>
      </div>

      <h3>{data.label}</h3>
      <p>{data.description}</p>

      <div className="node-footer">
        Logic Evaluation
      </div>
    </div>
  );
}

// ==========================================
// 3. ALERT NODE
// ==========================================

function AlertNode({ data }) {
  return (
    <div className="custom-node alert-node">
      <Handle type="target" position={Position.Top} />

      <div className="node-heading">
        <span className="node-icon">⚡</span>
        <span>ACTION</span>
      </div>

      <h3>{data.label}</h3>
      <p>{data.description}</p>

      <div className="node-footer">
        Notification Service
      </div>
    </div>
  );
}

// ==========================================
// 4. REGISTER CUSTOM NODE TYPES
// ==========================================

const nodeTypes = {
  sensor: SensorNode,
  condition: ConditionNode,
  alert: AlertNode,
};

// ==========================================
// 5. INITIAL NODES
// ==========================================

const initialNodes = [
  {
    id: '1',
    type: 'sensor',
    position: { x: 100, y: 80 },
    data: {
      label: 'Temperature Sensor',
      description: 'Collect machine temperature',
    },
  },

  {
    id: '2',
    type: 'condition',
    position: { x: 100, y: 260 },
    data: {
      label: 'Temperature > 80°C',
      description: 'Check temperature threshold',
    },
  },

  {
    id: '3',
    type: 'alert',
    position: { x: 100, y: 440 },
    data: {
      label: 'Send Alert',
      description: 'Notify machine operator',
    },
  },
];

// ==========================================
// 6. INITIAL CONNECTIONS
// ==========================================

const initialEdges = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    animated: true,
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },

  {
    id: 'e2-3',
    source: '2',
    target: '3',
    animated: true,
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
];

// ==========================================
// 7. NODE TEMPLATES
// ==========================================

const nodeTemplates = {
  sensor: {
    type: 'sensor',
    label: 'Temperature Sensor',
    description: 'Collect machine temperature',
  },

  condition: {
    type: 'condition',
    label: 'Temperature > 80°C',
    description: 'Check temperature threshold',
  },

  alert: {
    type: 'alert',
    label: 'Send Alert',
    description: 'Notify machine operator',
  },
};

// ==========================================
// 8. MAIN APP COMPONENT
// ==========================================

function App() {
  const [nodes, setNodes, onNodesChange] =
    useNodesState(initialNodes);

  const [edges, setEdges, onEdgesChange] =
    useEdgesState(initialEdges);

  // React Flow instance reference
  const reactFlowInstance = useRef(null);

  // Unique ID counter
  const idCounter = useRef(4);

  // ========================================
  // CONNECT NODES
  // ========================================

  const onConnect = useCallback(
    (connection) => {
      setEdges((currentEdges) =>
        addEdge(
          {
            ...connection,
            animated: true,
            markerEnd: {
              type: MarkerType.ArrowClosed,
            },
          },
          currentEdges
        )
      );
    },
    [setEdges]
  );

  // ========================================
  // ADD NODE TO CANVAS
  // ========================================

  const addNode = useCallback(
    (type, position) => {
      const template = nodeTemplates[type];

      if (!template) return;

      const newNode = {
        id: String(idCounter.current++),
        type: template.type,
        position,
        data: {
          label: template.label,
          description: template.description,
        },
      };

      setNodes((currentNodes) => [
        ...currentNodes,
        newNode,
      ]);
    },
    [setNodes]
  );

  // ========================================
  // DRAG NODE FROM SIDEBAR
  // ========================================

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData(
      'application/reactflow',
      nodeType
    );

    event.dataTransfer.effectAllowed = 'move';
  };

  // ========================================
  // ALLOW DROP ON CANVAS
  // ========================================

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // ========================================
  // DROP NODE ON CANVAS
  // ========================================

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData(
        'application/reactflow'
      );

      if (!type || !reactFlowInstance.current) {
        return;
      }

      const position =
        reactFlowInstance.current.screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });

      addNode(type, position);
    },
    [addNode]
  );

  // ========================================
  // CLEAR CANVAS
  // ========================================

  const clearCanvas = () => {
    setNodes([]);
    setEdges([]);
  };

  // ========================================
  // MAIN UI
  // ========================================

  return (
    <div className="app-container">

      {/* TOP NAVIGATION */}

      <header className="topbar">

        <div className="brand">

          <div className="brand-logo">
            ⚡
          </div>

          <div>
            <h2>IoT Rule Engine</h2>
            <span>Visual Workflow Builder</span>
          </div>

        </div>

        <div className="topbar-right">

          <span className="status-indicator">
            <span className="status-dot"></span>
            Editor Ready
          </span>

          <button
            className="clear-button"
            onClick={clearCanvas}
          >
            Clear Canvas
          </button>

        </div>

      </header>

      {/* MAIN WORKSPACE */}

      <div className="workspace">

        {/* SIDEBAR */}

        <aside className="sidebar">

          <div className="sidebar-heading">
            <h3>Node Library</h3>
            <p>Drag nodes onto the canvas</p>
          </div>

          {/* SENSOR CATEGORY */}

          <div className="node-category">

            <span>INPUT</span>

            <div
              className="sidebar-node sensor-card"
              draggable
              onDragStart={(event) =>
                onDragStart(event, 'sensor')
              }
              onClick={() =>
                addNode('sensor', { x: 100, y: 100 })
              }
            >

              <span className="sidebar-icon">◉</span>

              <div>
                <strong>Sensor</strong>
                <small>Receive IoT data</small>
              </div>

              <span className="plus-icon">+</span>

            </div>

          </div>

          {/* CONDITION CATEGORY */}

          <div className="node-category">

            <span>LOGIC</span>

            <div
              className="sidebar-node condition-card"
              draggable
              onDragStart={(event) =>
                onDragStart(event, 'condition')
              }
              onClick={() =>
                addNode('condition', { x: 100, y: 100 })
              }
            >

              <span className="sidebar-icon">◇</span>

              <div>
                <strong>Condition</strong>
                <small>Evaluate a rule</small>
              </div>

              <span className="plus-icon">+</span>

            </div>

          </div>

          {/* ALERT CATEGORY */}

          <div className="node-category">

            <span>ACTIONS</span>

            <div
              className="sidebar-node alert-card"
              draggable
              onDragStart={(event) =>
                onDragStart(event, 'alert')
              }
              onClick={() =>
                addNode('alert', { x: 100, y: 100 })
              }
            >

              <span className="sidebar-icon">⚡</span>

              <div>
                <strong>Alert</strong>
                <small>Send notification</small>
              </div>

              <span className="plus-icon">+</span>

            </div>

          </div>

          {/* SIDEBAR INSTRUCTIONS */}

          <div className="sidebar-tip">

            <strong>How to use</strong>

            <p>
              Drag a node into the workspace or click it
              to add it. Connect nodes using their handles.
            </p>

          </div>

        </aside>

        {/* WORKFLOW CANVAS */}

        <main className="canvas-area">

          <div className="canvas-toolbar">

            <div>
              <h3>Workflow Canvas</h3>
              <p>
                Design your IoT automation visually
              </p>
            </div>

            <div className="canvas-stats">

              <span>
                {nodes.length} Nodes
              </span>

              <span>
                {edges.length} Connections
              </span>

            </div>

          </div>

          {/* REACT FLOW EDITOR */}

          <div
            className="flow-wrapper"
            onDrop={onDrop}
            onDragOver={onDragOver}
          >

            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}

              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}

              onInit={(instance) => {
                reactFlowInstance.current = instance;
              }}

              fitView

              deleteKeyCode={['Backspace', 'Delete']}
            >

              <Background
                color="#aeb8c7"
                gap={20}
                size={1}
              />

              <Controls />

              <MiniMap
                nodeStrokeWidth={3}
                zoomable
                pannable
              />

            </ReactFlow>

          </div>

          {/* CANVAS FOOTER */}

          <footer className="canvas-footer">

            <span>● Visual Editor</span>

            <span>Built with React Flow</span>

          </footer>

        </main>

      </div>

    </div>
  );
}

export default App;
