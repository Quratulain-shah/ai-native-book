import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  BackgroundVariant,
  Panel
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useHistory } from '@docusaurus/router';

// Custom node types with glassmorphism and neon styling
import ModuleNode from './ModuleNode';
import LessonNode from './LessonNode';

// Register custom node types
const nodeTypes = {
  moduleNode: ModuleNode,
  lessonNode: LessonNode,
};

// Default knowledge map data
const initialNodes = [
  {
    id: 'module-1',
    type: 'moduleNode',
    position: { x: 0, y: 0 },
    data: {
      label: 'Introduction to Robotics',
      description: 'Basic concepts and principles',
      connections: 3,
      path: '/docs/01-module-1/00-module-overview'
    },
  },
  {
    id: 'module-2',
    type: 'moduleNode',
    position: { x: 300, y: -100 },
    data: {
      label: 'Hardware Components',
      description: 'Motors, sensors, and actuators',
      connections: 2,
      path: '/docs/02-module-2/00-module-overview'
    },
  },
  {
    id: 'module-3',
    type: 'moduleNode',
    position: { x: 300, y: 100 },
    data: {
      label: 'Control Systems',
      description: 'Feedback and control theory',
      connections: 4,
      path: '/docs/03-module-3/00-module-overview'
    },
  },
  {
    id: 'lesson-1',
    type: 'lessonNode',
    position: { x: 600, y: -200 },
    data: {
      label: 'Robot Kinematics',
      description: 'Forward and inverse kinematics',
      duration: '45 min',
      path: '/docs/01-module-1/01-ros2-fundamentals'
    },
  },
  {
    id: 'lesson-2',
    type: 'lessonNode',
    position: { x: 600, y: -50 },
    data: {
      label: 'Sensors Integration',
      description: 'Types and applications',
      duration: '30 min',
      path: '/docs/02-module-2/01-gazebo-physics'
    },
  },
  {
    id: 'lesson-3',
    type: 'lessonNode',
    position: { x: 600, y: 100 },
    data: {
      label: 'Path Planning',
      description: 'Algorithms and techniques',
      duration: '60 min',
      path: '/docs/03-module-3/01-nvidia-isaac-sim'
    },
  },
  {
    id: 'lesson-4',
    type: 'lessonNode',
    position: { x: 600, y: 250 },
    data: {
      label: 'Machine Learning',
      description: 'AI for robotics applications',
      duration: '90 min',
      path: '/docs/04-module-4/01-vision-language-action'
    },
  },
];

const initialEdges = [
  { id: 'e1-2', source: 'module-1', target: 'module-2', animated: true },
  { id: 'e1-3', source: 'module-1', target: 'module-3', animated: true },
  { id: 'e2-lesson1', source: 'module-2', target: 'lesson-1', animated: true },
  { id: 'e2-lesson2', source: 'module-2', target: 'lesson-2', animated: true },
  { id: 'e3-lesson2', source: 'module-3', target: 'lesson-2', animated: true },
  { id: 'e3-lesson3', source: 'module-3', target: 'lesson-3', animated: true },
  { id: 'e3-lesson4', source: 'module-3', target: 'lesson-4', animated: true },
];

// Mobile check component
const MobileKnowledgeMap = ({ onShowFullMap }) => {
  return (
    <div className="mobile-knowledge-map">
      <div className="glassmorphism-card p-6 rounded-xl border border-cyan-500/30 bg-black/20 backdrop-blur-sm shadow-lg shadow-cyan-500/10">
        <h3 className="text-xl font-orbitron text-cyan-400 mb-4">Knowledge Map</h3>
        <p className="text-gray-300 mb-4">Interactive visualization of learning modules and concepts</p>
        <button
          onClick={onShowFullMap}
          className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg text-white font-medium hover:from-cyan-500 hover:to-blue-500 transition-all border border-cyan-400/50"
        >
          View Full Map
        </button>
      </div>

      <div className="mt-4 space-y-3">
        <div className="glassmorphism-card p-4 rounded-lg border border-cyan-500/20 bg-black/10 backdrop-blur-sm">
          <h4 className="text-cyan-400 font-semibold">Introduction to Robotics</h4>
          <p className="text-sm text-gray-400">Basic concepts and principles</p>
          <div className="flex gap-2 mt-2">
            <span className="text-xs bg-cyan-900/50 text-cyan-300 px-2 py-1 rounded">3 connections</span>
          </div>
        </div>

        <div className="glassmorphism-card p-4 rounded-lg border border-cyan-500/20 bg-black/10 backdrop-blur-sm">
          <h4 className="text-cyan-400 font-semibold">Hardware Components</h4>
          <p className="text-sm text-gray-400">Motors, sensors, and actuators</p>
          <div className="flex gap-2 mt-2">
            <span className="text-xs bg-cyan-900/50 text-cyan-300 px-2 py-1 rounded">2 connections</span>
          </div>
        </div>

        <div className="glassmorphism-card p-4 rounded-lg border border-cyan-500/20 bg-black/10 backdrop-blur-sm">
          <h4 className="text-cyan-400 font-semibold">Control Systems</h4>
          <p className="text-sm text-gray-400">Feedback and control theory</p>
          <div className="flex gap-2 mt-2">
            <span className="text-xs bg-cyan-900/50 text-cyan-300 px-2 py-1 rounded">4 connections</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const KnowledgeMap = ({
  nodes: initialDataNodes = null,
  edges: initialDataEdges = null,
  width = '100%',
  height = '600px',
  showControls = true,
  showMinimap = true,
  showBackground = true,
  onNodeClick = null
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialDataNodes || initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialDataEdges || initialEdges);
  const [isMobile, setIsMobile] = useState(false);
  const [showFullMap, setShowFullMap] = useState(false);

  // Check for mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle node click
  const onNodeClickHandler = useCallback((event, node) => {
    if (onNodeClick) {
      onNodeClick(event, node);
    } else {
      // Default navigation behavior
      const history = useHistory();
      if (history && node.data?.path) {
        event.preventDefault();
        history.push(node.data.path);
      }
    }
  }, [onNodeClick]);

  // Handle edge click
  const onEdgeClickHandler = useCallback((event, edge) => {
    console.log('Edge clicked:', edge);
  }, []);

  // Custom connection line style for circuit traces
  const connectionLineStyle = {
    stroke: '#00ffff', // cyan color
    strokeWidth: 2,
    strokeDasharray: '10,5', // animated dash effect
  };

  // Custom connection line for circuit traces
  const connectionLineComponent = ({ fromX, fromY, toX, toY, connectionLineStyle: style }) => {
    return (
      <svg>
        <path
          d={`M ${fromX} ${fromY} L ${toX} ${fromY} L ${toX} ${toY}`}
          fill="none"
          stroke="#00ffff"
          strokeWidth="2"
          strokeDasharray="10,5"
          className="animate-pulse"
        />
      </svg>
    );
  };

  // If mobile and not showing full map, render simplified version
  if (isMobile && !showFullMap) {
    return <MobileKnowledgeMap onShowFullMap={() => setShowFullMap(true)} />;
  }

  return (
    <div
      className="knowledge-map-container w-full relative"
      style={{ width, height }}
    >
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClickHandler}
          onEdgeClick={onEdgeClickHandler}
          nodeTypes={nodeTypes}
          connectionLineStyle={connectionLineStyle}
          connectionLineComponent={connectionLineComponent}
          fitView
          fitViewOptions={{
            padding: 0.5,
            includeHiddenNodes: false
          }}
          minZoom={0.1}
          maxZoom={2}
          className="rounded-xl border border-cyan-500/30"
        >
          {showBackground && (
            <Background
              gap={24}
              size={1}
              color="#1a1a1a"
              variant={BackgroundVariant.Dots}
            />
          )}

          {showControls && <Controls className="bg-black/50 border border-cyan-500/30 rounded-lg" />}

          {showMinimap && (
            <MiniMap
              nodeColor={(node) => {
                if (node.type === 'moduleNode') return '#00ffff';
                if (node.type === 'lessonNode') return '#00aaff';
                return '#6366f1';
              }}
              className="bg-black/50 border border-cyan-500/30 rounded-lg"
            />
          )}

          <Panel position="top-right" className="bg-black/50 border border-cyan-500/30 rounded-lg p-2">
            <div className="text-cyan-400 text-sm font-orbitron">Knowledge Map</div>
          </Panel>
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
};

export default KnowledgeMap;