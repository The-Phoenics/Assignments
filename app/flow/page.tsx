"use client";

import { useCallback, useState, useRef } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type Connection,
  type NodeMouseHandler,
  BackgroundVariant,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const initialNodes: Node[] = [
  {
    id: "1",
    type: "default",
    data: { label: "Node 1" },
    position: { x: 250, y: 100 },
  },
  {
    id: "2",
    type: "default",
    data: { label: "Node 2" },
    position: { x: 400, y: 250 },
  },
];

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", animated: true },
];

export default function FlowPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const nodeIdCounter = useRef(3);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick: NodeMouseHandler = useCallback(
    (event, node) => {
      setSelectedNode(node.id);
    },
    []
  );

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const addNode = useCallback(() => {
    const newNode: Node = {
      id: `${nodeIdCounter.current}`,
      type: "default",
      data: { label: `Node ${nodeIdCounter.current}` },
      position: {
        x: Math.random() * 400 + 100,
        y: Math.random() * 400 + 100,
      },
    };
    nodeIdCounter.current += 1;
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  const deleteNode = useCallback(() => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((node) => node.id !== selectedNode));
      setEdges((eds) =>
        eds.filter(
          (edge) => edge.source !== selectedNode && edge.target !== selectedNode
        )
      );
      setSelectedNode(null);
    }
  }, [selectedNode, setNodes, setEdges]);

  const deleteAllNodes = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setSelectedNode(null);
  }, [setNodes, setEdges]);

  return (
    <div className="h-screen w-screen">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        fitView
        className="bg-gray-50 dark:bg-gray-900"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={12}
          size={1}
          color="#94a3b8"
        />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            if (node.id === selectedNode) return "#3b82f6";
            return "#94a3b8";
          }}
          className="bg-white dark:bg-gray-800"
        />
        <Panel position="top-left" className="space-y-2">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg space-y-2">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3">
              Flow Controls
            </h2>
            <button
              onClick={addNode}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors"
            >
              Add Node
            </button>
            <button
              onClick={deleteNode}
              disabled={!selectedNode}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded transition-colors"
            >
              Delete Selected
            </button>
            <button
              onClick={deleteAllNodes}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded transition-colors"
            >
              Clear All
            </button>
            {selectedNode && (
              <div className="mt-2 p-2 bg-blue-100 dark:bg-blue-900 rounded text-sm text-blue-800 dark:text-blue-200">
                Selected: Node {selectedNode}
              </div>
            )}
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">
              Instructions:
            </h3>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <li>• Click nodes to select them</li>
              <li>• Drag nodes to move them</li>
              <li>• Drag from handles to connect</li>
              <li>• Use controls to zoom/pan</li>
            </ul>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}
