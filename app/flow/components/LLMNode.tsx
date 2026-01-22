import { Handle, Position } from "@xyflow/react";
import { NodeWrapper } from "./NodeWrapper";

export function LLMNode({ data, id }: { data: { label?: string; onDuplicate: (id: string) => void; onDelete: (id: string) => void }; id: string }) {
  return (
    <div className="bg-[#212125] rounded-lg shadow-xl min-w-[220px] relative">
      <div className="absolute left-0 top-[20%] -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#212125] flex items-center justify-center">
        <Handle 
          type="target" 
          position={Position.Left} 
          className="w-5 h-5 bg-pink-500 border-2 border-white rounded-full"
          style={{ position: 'relative', transform: 'none', top: 'auto', right: 'auto', left: 'auto', bottom: 'auto' }}
        />
      </div>
      <div className="absolute -left-16 top-[20%] -translate-y-1/2 text-xs text-gray-400 whitespace-nowrap">
        Prompt
      </div>
      <div className="absolute left-0 top-[40%] -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#212125] flex items-center justify-center">
        <Handle
          type="target"
          position={Position.Left}
          id="input-2"
          className="w-5 h-5 bg-pink-500 border-2 border-white rounded-full"
          style={{ position: 'relative', transform: 'none', top: 'auto', right: 'auto', left: 'auto', bottom: 'auto' }}
        />
      </div>
      <div className="absolute -left-12 top-[40%] -translate-y-1/2 text-xs text-gray-400 whitespace-nowrap">
        Image
      </div>
      <div className="absolute left-0 top-[60%] -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#212125] flex items-center justify-center">
        <Handle
          type="target"
          position={Position.Left}
          id="input-3"
          className="w-5 h-5 bg-green-500 border-2 border-white rounded-full"
          style={{ position: 'relative', transform: 'none', top: 'auto', right: 'auto', left: 'auto', bottom: 'auto' }}
        />
      </div>
      <div className="absolute -left-12 top-[60%] -translate-y-1/2 text-xs text-gray-400 whitespace-nowrap">
        Video
      </div>
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
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 rounded-full bg-[#212125] flex items-center justify-center">
        <Handle 
          type="source" 
          position={Position.Right} 
          className="w-5 h-5 bg-green-500 border-2 border-white rounded-full"
          style={{ position: 'relative', transform: 'none', top: 'auto', right: 'auto', left: 'auto', bottom: 'auto' }}
        />
      </div>
      <div className="absolute -right-10 top-[40%] -translate-y-1/2 text-xs text-gray-400 whitespace-nowrap">
        Text
      </div>
    </div>
  );
}
