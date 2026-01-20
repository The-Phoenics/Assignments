import { Handle, Position } from "@xyflow/react";
import { NodeWrapper } from "./NodeWrapper";

export function ExtractVideoFrameNode({ data, id }: { data: { label?: string; onDuplicate: (id: string) => void; onDelete: (id: string) => void }; id: string }) {
  return (
    <div className="bg-[#212125] rounded-lg shadow-xl border border-gray-700 min-w-[220px]">
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-pink-500 border-2 border-white" />
      <NodeWrapper title="Extract Video Frame" nodeId={id} onDuplicate={data.onDuplicate} onDelete={data.onDelete}>
      <div className="p-3">
        <div
          className="w-full h-48 rounded mb-3"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, #353539, #353539 10px, #3a3a3e 10px, #3a3a3e 20px)',
          }}
        />
        <div className="flex gap-2 text-sm">
          <div className="flex-1">
            <label className="text-gray-400 text-xs">Frame</label>
              <input
                  type="text"
                  defaultValue="0"
                  className="w-full bg-[#353539] text-[#FFFFFF] rounded px-2 py-1 text-sm mt-1 focus:outline-none focus:ring-1 focus:ring-gray-600"
                />
              </div>
              <div className="flex-1">
                <label className="text-gray-400 text-xs">Timecode</label>
                <input
                  type="text"
                  defaultValue="00:00:00"
                  className="w-full bg-[#353539] text-[#FFFFFF] rounded px-2 py-1 text-sm mt-1 focus:outline-none focus:ring-1 focus:ring-gray-600"
            />
          </div>
        </div>
      </div>
      </NodeWrapper>
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-green-500 border-2 border-white" />
    </div>
  );
}
