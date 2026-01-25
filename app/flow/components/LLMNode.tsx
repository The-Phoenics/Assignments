import { Handle, Position, type Edge } from "@xyflow/react";
import { NodeWrapper } from "./NodeWrapper";
import { HANDLE_COLORS_HEX } from "@/app/lib/constants";

export function LLMNode({ data, id }: { data: { label?: string; onDuplicate: (id: string) => void; onDelete: (id: string) => void; edges?: Edge[] }; id: string }) {
  const isHandleConnected = (handleId: string, handleType: 'source' | 'target') => {
    if (!data.edges) return false;
    return data.edges.some(edge => 
      handleType === 'source' 
        ? edge.source === id && edge.sourceHandle === handleId
        : edge.target === id && edge.targetHandle === handleId
    );
  };

  const textInputConnected = isHandleConnected('text-input', 'target');
  const imageInputConnected = isHandleConnected('image-input', 'target');
  const videoInputConnected = isHandleConnected('video-input', 'target');
  const textOutputConnected = isHandleConnected('text-output', 'source');
  return (
    <div className="bg-[#222226] rounded-lg shadow-xl min-w-[350px] relative pt-4">
      <div className="absolute left-0 top-[20%] -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#212125] flex items-center justify-center">
        <Handle 
          type="target" 
          position={Position.Left}
          id="text-input"
          className={`w-5 h-5 border-2 rounded-full flex items-center justify-center p-1`}
          style={{ position: 'relative', transform: 'none', top: 'auto', right: 'auto', left: 'auto', bottom: 'auto', borderColor: HANDLE_COLORS_HEX.text }}
        >
          <div className="rounded-full w-1 h-1 p-[2px]" style={{
            backgroundColor: textInputConnected ? HANDLE_COLORS_HEX.text : 'transparent'
          }} />
        </Handle>
      </div>
      <div className="absolute -left-10 top-[20%] -translate-y-1/2 text-xs text-gray-400 whitespace-nowrap">
        Text
      </div>
      <div className="absolute left-0 top-[40%] -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#212125] flex items-center justify-center">
        <Handle
          type="target"
          position={Position.Left}
          id="image-input"
          className={`w-5 h-5 border-2 rounded-full flex items-center justify-center p-1`}
          style={{ position: 'relative', transform: 'none', top: 'auto', right: 'auto', left: 'auto', bottom: 'auto', borderColor: HANDLE_COLORS_HEX.image }}
        >
          <div className="rounded-full w-1 h-1 p-[2px]" style={{
            backgroundColor: imageInputConnected ? HANDLE_COLORS_HEX.image : 'transparent'
          }} />
        </Handle>
      </div>
      <div className="absolute -left-12 top-[40%] -translate-y-1/2 text-xs text-gray-400 whitespace-nowrap">
        Image
      </div>
      <div className="absolute left-0 top-[60%] -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#212125] flex items-center justify-center">
        <Handle
          type="target"
          position={Position.Left}
          id="video-input"
          className={`w-5 h-5 border-2 rounded-full flex items-center justify-center p-1`}
          style={{ position: 'relative', transform: 'none', top: 'auto', right: 'auto', left: 'auto', bottom: 'auto', borderColor: HANDLE_COLORS_HEX.video }}
        >
          <div className="rounded-full w-1 h-1 p-[2px]" style={{
            backgroundColor: videoInputConnected ? HANDLE_COLORS_HEX.video : 'transparent'
          }} />
        </Handle>
      </div>
      <div className="absolute -left-12 top-[60%] -translate-y-1/2 text-xs text-gray-400 whitespace-nowrap">
        Video
      </div>
      <NodeWrapper title="Any LLM" nodeId={id} onDuplicate={data.onDuplicate} onDelete={data.onDelete}>
      <div className="p-3">
        <div className="w-full h-48 rounded bg-[#353539] flex items-center justify-center mb-3">
          <span className="text-gray-500 text-sm">The generated text will appear here</span>
        </div>
        <button className="text-gray-400 text-xs hover:text-gray-300 mb-2 block">
          + Add another image input
        </button>
        <button className="w-full border border-gray-600 hover:border-gray-500 text-white font-medium py-2 px-4 rounded transition-colors flex items-center justify-center gap-2">
          <span>→</span>
          <span>Run Model</span>
        </button>
      </div>
      </NodeWrapper>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 rounded-full bg-[#212125] flex items-center justify-center">
        <Handle 
          type="source" 
          position={Position.Right}
          id="text-output"
          className={`w-5 h-5 border-2 rounded-full flex items-center justify-center p-1`}
          style={{ position: 'relative', transform: 'none', top: 'auto', right: 'auto', left: 'auto', bottom: 'auto', borderColor: HANDLE_COLORS_HEX.text }}
        >
          <div className="rounded-full w-1 h-1 p-[2px]" style={{
            backgroundColor: textOutputConnected ? HANDLE_COLORS_HEX.text : 'transparent'
          }} />
        </Handle>
      </div>
      <div className="absolute -right-10 top-[40%] -translate-y-1/2 text-xs text-gray-400 whitespace-nowrap">
        Text
      </div>
    </div>
  );
}
