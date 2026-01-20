import { Handle, Position } from "@xyflow/react";
import { NodeWrapper } from "./NodeWrapper";

export function LLMNode({ data, id }: { data: { label?: string; onDuplicate: (id: string) => void; onDelete: (id: string) => void }; id: string }) {
  return (
    <div className="bg-[#212125] rounded-lg shadow-xl border border-gray-700 min-w-[220px]">
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
      <NodeWrapper title="Any LLM" nodeId={id} onDuplicate={data.onDuplicate} onDelete={data.onDelete}>
      <div className="p-3">
        <div className="w-full h-48 rounded bg-[#353539] flex items-center justify-center mb-3">
          <span className="text-gray-500 text-sm">The generated text will appear here</span>
        </div>
        <button className="text-gray-400 text-xs hover:text-gray-300 mb-2">
          + Add another image input
        </button>
        <button className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded transition-colors">
          Run Model
        </button>
      </div>
      </NodeWrapper>
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-green-500 border-2 border-white" />
    </div>
  );
}
