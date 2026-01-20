import { Handle, Position } from "@xyflow/react";

export function LLMNode({ data }: { data: { label?: string } }) {
  return (
    <div className="bg-[#2a2a2a] rounded-lg shadow-xl border border-gray-700 min-w-[220px]">
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-pink-500 border-2 border-white" />
      <Handle
        type="target"
        position={Position.Left}
        id="input-2"
        style={{ top: "30%" }}
        className="w-3 h-3 bg-pink-500 border-2 border-white"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="input-3"
        style={{ top: "50%" }}
        className="w-3 h-3 bg-green-500 border-2 border-white"
      />
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700">
        <span className="text-gray-300 text-sm font-medium">Any LLM</span>
        <button className="text-gray-500 hover:text-gray-300">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>
      <div className="p-3">
        <div className="w-full h-48 rounded bg-[#1a1a1a] flex items-center justify-center mb-3">
          <span className="text-gray-500 text-sm">The generated text will appear here</span>
        </div>
        <button className="text-gray-400 text-xs hover:text-gray-300 mb-2">
          + Add another image input
        </button>
        <button className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded transition-colors">
          Run Model
        </button>
      </div>
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-green-500 border-2 border-white" />
    </div>
  );
}
