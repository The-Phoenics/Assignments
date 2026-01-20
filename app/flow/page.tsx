"use client";

import { useCallback, useState, useRef } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  addEdge,
  useNodesState,
  useEdgesState,
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

const nodeTypes: NodeTypes = {
  fileNode: FileNode,
  textNode: TextNode,
  promptNode: PromptNode,
  cropNode: CropNode,
  llmNode: LLMNode,
  extractVideoFrameNode: ExtractVideoFrameNode,
};

const initialNodes: Node[] = [
  {
    id: "1",
    type: "fileNode",
    data: { label: "File" },
    position: { x: 50, y: 50 },
  },
  {
    id: "2",
    type: "textNode",
    data: { label: "Text" },
    position: { x: 350, y: 50 },
  },
  {
    id: "3",
    type: "fileNode",
    data: { label: "File", imageUrl: "" },
    position: { x: 350, y: 200 },
  },
  {
    id: "4",
    type: "promptNode",
    data: { label: "Prompt" },
    position: { x: 50, y: 400 },
  },
  {
    id: "5",
    type: "cropNode",
    data: { label: "Crop" },
    position: { x: 350, y: 380 },
  },
  {
    id: "6",
    type: "llmNode",
    data: { label: "Any LLM" },
    position: { x: 650, y: 50 },
  },
  {
    id: "7",
    type: "extractVideoFrameNode",
    data: { label: "Extract Video Frame" },
    position: { x: 650, y: 400 },
  },
];

const initialEdges: Edge[] = [
  {
    id: "e4-5",
    source: "4",
    target: "5",
    style: { stroke: "#ef4444", strokeWidth: 2 },
  },
];

export default function FlowPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const nodeIdCounter = useRef(8);

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

  const addNode = useCallback((type: string) => {
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
      data: config.data,
      position: {
        x: Math.random() * 400 + 100,
        y: Math.random() * 400 + 100,
      },
    };
    nodeIdCounter.current += 1;
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  const deleteSelectedNodes = useCallback(() => {
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
    <div className="h-screen w-screen bg-[#1a1a1a]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="bg-[#1a1a1a]"
        onNodeClick={(_, node) => setSelectedNode(node.id)}
        onPaneClick={() => setSelectedNode(null)}
        defaultEdgeOptions={{
          style: { stroke: "#ef4444", strokeWidth: 2 },
        }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#333333"
          className="bg-[#1a1a1a]"
        />
        <Controls className="bg-[#2a2a2a] border border-gray-700" />

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

        {/* Add Node Menu */}
        <Panel position="top-right" className="mt-4 mr-4">
          <div className="bg-[#2a2a2a] border border-gray-700 rounded-lg p-3 shadow-xl">
            <h3 className="text-gray-300 text-sm font-semibold mb-2">Add Node</h3>
            <div className="space-y-1">
              <button
                onClick={() => addNode("file")}
                className="w-full text-left text-gray-300 hover:bg-gray-700 px-3 py-2 rounded text-sm transition-colors"
              >
                📁 File
              </button>
              <button
                onClick={() => addNode("text")}
                className="w-full text-left text-gray-300 hover:bg-gray-700 px-3 py-2 rounded text-sm transition-colors"
              >
                📝 Text
              </button>
              <button
                onClick={() => addNode("prompt")}
                className="w-full text-left text-gray-300 hover:bg-gray-700 px-3 py-2 rounded text-sm transition-colors"
              >
                💬 Prompt
              </button>
              <button
                onClick={() => addNode("crop")}
                className="w-full text-left text-gray-300 hover:bg-gray-700 px-3 py-2 rounded text-sm transition-colors"
              >
                ✂️ Crop
              </button>
              <button
                onClick={() => addNode("llm")}
                className="w-full text-left text-gray-300 hover:bg-gray-700 px-3 py-2 rounded text-sm transition-colors"
              >
                🤖 LLM
              </button>
              <button
                onClick={() => addNode("extract")}
                className="w-full text-left text-gray-300 hover:bg-gray-700 px-3 py-2 rounded text-sm transition-colors"
              >
                🎬 Extract Frame
              </button>
            </div>
            {selectedNode && (
              <>
                <div className="h-px bg-gray-700 my-2" />
                <button
                  onClick={deleteSelectedNodes}
                  className="w-full text-left text-red-400 hover:bg-red-900 hover:bg-opacity-20 px-3 py-2 rounded text-sm transition-colors"
                >
                  🗑️ Delete Selected
                </button>
              </>
            )}
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}
