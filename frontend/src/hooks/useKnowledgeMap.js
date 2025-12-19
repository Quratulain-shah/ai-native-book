import { useState, useCallback } from 'react';
import { useHistory } from '@docusaurus/router';

// Knowledge map data structure
const initialKnowledgeMapData = {
  nodes: [
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
  ],
  edges: [
    { id: 'e1-2', source: 'module-1', target: 'module-2', animated: true },
    { id: 'e1-3', source: 'module-1', target: 'module-3', animated: true },
    { id: 'e2-lesson1', source: 'module-2', target: 'lesson-1', animated: true },
    { id: 'e2-lesson2', source: 'module-2', target: 'lesson-2', animated: true },
    { id: 'e3-lesson2', source: 'module-3', target: 'lesson-2', animated: true },
    { id: 'e3-lesson3', source: 'module-3', target: 'lesson-3', animated: true },
    { id: 'e3-lesson4', source: 'module-3', target: 'lesson-4', animated: true },
  ],
};

const useKnowledgeMap = (initialData = null) => {
  const [knowledgeMapData, setKnowledgeMapData] = useState(
    initialData || initialKnowledgeMapData
  );
  const [selectedNode, setSelectedNode] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const history = useHistory ? useHistory() : null;

  // Update nodes data
  const updateNodes = useCallback((newNodes) => {
    setKnowledgeMapData(prev => ({
      ...prev,
      nodes: newNodes
    }));
  }, []);

  // Update edges data
  const updateEdges = useCallback((newEdges) => {
    setKnowledgeMapData(prev => ({
      ...prev,
      edges: newEdges
    }));
  }, []);

  // Add a new node
  const addNode = useCallback((node) => {
    setKnowledgeMapData(prev => ({
      ...prev,
      nodes: [...prev.nodes, node]
    }));
  }, []);

  // Remove a node
  const removeNode = useCallback((nodeId) => {
    setKnowledgeMapData(prev => ({
      ...prev,
      nodes: prev.nodes.filter(node => node.id !== nodeId),
      edges: prev.edges.filter(
        edge => edge.source !== nodeId && edge.target !== nodeId
      )
    }));
  }, []);

  // Find node by ID
  const findNode = useCallback((nodeId) => {
    return knowledgeMapData.nodes.find(node => node.id === nodeId);
  }, [knowledgeMapData.nodes]);

  // Find all nodes connected to a specific node
  const findConnectedNodes = useCallback((nodeId) => {
    const connectedEdgeIds = knowledgeMapData.edges
      .filter(edge => edge.source === nodeId || edge.target === nodeId)
      .map(edge => edge.source === nodeId ? edge.target : edge.source);

    return knowledgeMapData.nodes.filter(node =>
      connectedEdgeIds.includes(node.id)
    );
  }, [knowledgeMapData.edges, knowledgeMapData.nodes]);

  // Navigate to a node's path
  const navigateToNode = useCallback((node) => {
    if (!history || !node.data?.path) {
      console.warn('Navigation not available or path not set for node:', node);
      return;
    }

    try {
      setIsLoading(true);
      setSelectedNode(node);
      history.push(node.data.path);
    } catch (err) {
      setError(err.message);
      console.error('Navigation error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [history]);

  // Handle node click - this should be used in the KnowledgeMap component
  const handleNodeClick = useCallback((event, node) => {
    event.preventDefault();
    navigateToNode(node);
  }, [navigateToNode]);

  // Get all modules (nodes with type moduleNode)
  const getModules = useCallback(() => {
    return knowledgeMapData.nodes.filter(node => node.type === 'moduleNode');
  }, [knowledgeMapData.nodes]);

  // Get all lessons (nodes with type lessonNode)
  const getLessons = useCallback(() => {
    return knowledgeMapData.nodes.filter(node => node.type === 'lessonNode');
  }, [knowledgeMapData.nodes]);

  // Get nodes by category
  const getNodesByType = useCallback((type) => {
    return knowledgeMapData.nodes.filter(node => node.type === type);
  }, [knowledgeMapData.nodes]);

  // Reset selection
  const resetSelection = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // Get current state
  const getState = useCallback(() => {
    return {
      nodes: knowledgeMapData.nodes,
      edges: knowledgeMapData.edges,
      selectedNode,
      isLoading,
      error,
    };
  }, [knowledgeMapData, selectedNode, isLoading, error]);

  return {
    // State
    nodes: knowledgeMapData.nodes,
    edges: knowledgeMapData.edges,
    selectedNode,
    isLoading,
    error,

    // Actions
    updateNodes,
    updateEdges,
    addNode,
    removeNode,
    findNode,
    findConnectedNodes,
    navigateToNode,
    handleNodeClick,
    getModules,
    getLessons,
    getNodesByType,
    resetSelection,
    getState,
  };
};

export default useKnowledgeMap;