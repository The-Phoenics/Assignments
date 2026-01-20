import { Handle, Position } from "@xyflow/react";

export function CropNode({ data }: { data: { label?: string } }) {
  return (
    <div className="bg-[#2a2a2a] rounded-lg shadow-xl border border-gray-700 min-w-[220px]">
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-pink-500 border-2 border-white" />
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700">
        <span className="text-gray-300 text-sm font-medium">Crop</span>
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
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">Aspect ratio</span>
            <button className="text-gray-400 hover:text-gray-300">Reset</button>
          </div>
          <div className="flex gap-2">
            <select className="flex-1 bg-[#1a1a1a] text-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-gray-600">
              <option>Custom</option>
              <option>16:9</option>
              <option>4:3</option>
              <option>1:1</option>
            </select>
          </div>
          <div className="flex gap-2 text-sm">
            <div className="flex-1">
              <label className="text-gray-400 text-xs">Dimensions</label>
              <div className="flex items-center gap-1 mt-1">
                <input
                  type="text"
                  defaultValue="1024"
                  className="w-full bg-[#1a1a1a] text-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-gray-600"
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="text-gray-400 text-xs opacity-0">H</label>
              <input
                type="text"
                defaultValue="1024"
                className="w-full bg-[#1a1a1a] text-gray-300 rounded px-2 py-1 text-sm mt-1 focus:outline-none focus:ring-1 focus:ring-gray-600"
              />
            </div>
          </div>
        </div>
      </div>
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-pink-500 border-2 border-white" />
    </div>
  );
}
