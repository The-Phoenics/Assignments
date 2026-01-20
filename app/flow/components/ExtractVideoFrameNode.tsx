import { Handle, Position } from "@xyflow/react";

export function ExtractVideoFrameNode({ data }: { data: { label?: string } }) {
  return (
    <div className="bg-[#2a2a2a] rounded-lg shadow-xl border border-gray-700 min-w-[220px]">
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-pink-500 border-2 border-white" />
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700">
        <span className="text-gray-300 text-sm font-medium">Extract Video Frame</span>
        <button className="text-gray-500 hover:text-gray-300">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>
      <div className="p-3">
        <div
          className="w-full h-48 rounded mb-3"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, #1a1a1a, #1a1a1a 10px, #252525 10px, #252525 20px)',
          }}
        />
        <div className="flex gap-2 text-sm">
          <div className="flex-1">
            <label className="text-gray-400 text-xs">Frame</label>
            <input
              type="text"
              defaultValue="0"
              className="w-full bg-[#1a1a1a] text-gray-300 rounded px-2 py-1 text-sm mt-1 focus:outline-none focus:ring-1 focus:ring-gray-600"
            />
          </div>
          <div className="flex-1">
            <label className="text-gray-400 text-xs">Timecode</label>
            <input
              type="text"
              defaultValue="00:00:00"
              className="w-full bg-[#1a1a1a] text-gray-300 rounded px-2 py-1 text-sm mt-1 focus:outline-none focus:ring-1 focus:ring-gray-600"
            />
          </div>
        </div>
      </div>
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-green-500 border-2 border-white" />
    </div>
  );
}
