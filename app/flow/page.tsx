"use client";

import { useCallback, useState, useRef } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  type Node,
  type Edge,
  type Connection,
  type NodeTypes,
  BackgroundVariant,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { FileNode } from "./components/FileNode";
import { TextNode } from "./components/TextNode";
import { PromptNode } from "./components/PromptNode";
import { CropNode } from "./components/CropNode";
import { LLMNode } from "./components/LLMNode";
import { ExtractVideoFrameNode } from "./components/ExtractVideoFrameNode";
import { Sidebar } from "./components/Sidebar";

const nodeTypes: NodeTypes = {
  fileNode: FileNode,
  textNode: TextNode,
  promptNode: PromptNode,
  cropNode: CropNode,
  llmNode: LLMNode,
  extractVideoFrameNode: ExtractVideoFrameNode,
};

const initialNodes: Node[] = [];

const initialEdges: Edge[] = [];

function FlowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const nodeIdCounter = useRef(1);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        style: { stroke: "#ef4444", strokeWidth: 2 },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  const duplicateNode = useCallback((nodeId: string) => {
    setNodes((nds) => {
      const nodeToDuplicate = nds.find((n) => n.id === nodeId);
      if (!nodeToDuplicate) return nds;

      const newNode: Node = {
        ...nodeToDuplicate,
        id: `${nodeIdCounter.current}`,
        position: {
          x: nodeToDuplicate.position.x + 50,
          y: nodeToDuplicate.position.y + 50,
        },
        data: {
          ...nodeToDuplicate.data,
          onDuplicate: duplicateNode,
          onDelete: deleteNode,
        },
      };
      nodeIdCounter.current += 1;
      return [...nds, newNode];
    });
  }, []);

  const deleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) =>
      eds.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      )
    );
  }, [setNodes, setEdges]);

  const createNode = useCallback((type: string, position: { x: number; y: number }) => {
    const nodeConfig: Record<string, { type: string; data: { label: string } }> = {
      file: { type: "fileNode", data: { label: "File" } },
      text: { type: "textNode", data: { label: "Text" } },
      prompt: { type: "promptNode", data: { label: "Prompt" } },
      crop: { type: "cropNode", data: { label: "Crop" } },
      llm: { type: "llmNode", data: { label: "Any LLM" } },
      extract: { type: "extractVideoFrameNode", data: { label: "Extract Video Frame" } },
    };

    const config = nodeConfig[type];
    if (!config) return;

    const newNode: Node = {
      id: `${nodeIdCounter.current}`,
      type: config.type,
      data: {
        ...config.data,
        onDuplicate: duplicateNode,
        onDelete: deleteNode,
      },
      position,
    };
    nodeIdCounter.current += 1;
    setNodes((nds) => [...nds, newNode]);
  }, [duplicateNode, deleteNode, setNodes]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");
      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      createNode(type, position);
    },
    [screenToFlowPosition, createNode]
  );

  const onNodeDragStart = useCallback((event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  }, []);

  const handleUndo = useCallback(() => {
    // Undo functionality would be implemented here
    console.log("Undo");
  }, []);

  const handleRedo = useCallback(() => {
    // Redo functionality would be implemented here
    console.log("Redo");
  }, []);

  const handlePlay = useCallback(() => {
    // Play functionality would be implemented here
    console.log("Play");
  }, []);

  return (
    <div className="h-screen w-screen bg-[#1a1a1a]" ref={reactFlowWrapper}>
      <Sidebar onNodeDragStart={onNodeDragStart} />
      <div className="h-full w-full pl-[52px]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          fitView
          className="bg-[#C0E0E1]"
          defaultEdgeOptions={{
            style: { stroke: "#ef4444", strokeWidth: 2 },
          }}
          panOnScroll={true}
          zoomOnScroll={false}
        >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#FFFFFF"
          className="bg-[#C0E0E1]"
        />

        {/* Bottom Toolbar */}
        <Panel position="bottom-center" className="mb-4">
          <div className="bg-[#2a2a2a] border border-gray-700 rounded-lg px-4 py-2 flex items-center gap-4 shadow-xl">
            <button
              onClick={handlePlay}
              className="bg-yellow-400 hover:bg-yellow-500 text-black rounded p-2 transition-colors"
              title="Run workflow"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </button>

            <div className="h-6 w-px bg-gray-600" />

            <button
              onClick={handleUndo}
              className="text-gray-400 hover:text-gray-200 p-1 transition-colors"
              title="Undo"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
            </button>

            <button
              onClick={handleRedo}
              className="text-gray-400 hover:text-gray-200 p-1 transition-colors"
              title="Redo"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
              </svg>
            </button>

            <div className="h-6 w-px bg-gray-600" />

            <div className="text-gray-400 text-sm font-medium">
              57%
            </div>

            <button className="text-gray-400 hover:text-gray-200 p-1 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </Panel>
      </ReactFlow>
      </div>
    </div>
  );
}

export default function FlowPage() {
  return (
    <ReactFlowProvider>
      <FlowCanvas />
    </ReactFlowProvider>
  );
}
