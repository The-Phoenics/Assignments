import { Handle, Position } from "@xyflow/react";

export function PromptNode({ data }: { data: { label?: string; text?: string } }) {
  return (
    <div className="bg-[#2a2a2a] rounded-lg shadow-xl border border-gray-700 min-w-[220px]">
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-pink-500 border-2 border-white" />
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700">
        <span className="text-gray-300 text-sm font-medium">Prompt</span>
        <button className="text-gray-500 hover:text-gray-300">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>
      <div className="p-3">
        <div className="bg-[#1a1a1a] text-gray-300 rounded px-3 py-2 text-sm min-h-[100px]">
          {data.text ?? "Hipster Sisyphus, lime dots overall suit, pushing a huge round rock up a hill. The rock is sprayed with the text 'default prompt', bright gray background extreme side long shot, cinematic, fashion style, side view"}
        </div>
      </div>
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-pink-500 border-2 border-white" />
    </div>
  );
}
