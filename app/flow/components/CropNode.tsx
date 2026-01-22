import { Handle, Position, type Edge } from "@xyflow/react";
import { NodeWrapper } from "./NodeWrapper";
import { HANDLES_COLORS, HANDLE_BORDER_COLORS, HANDLE_COLORS_HEX } from "@/app/lib/constants";

export function CropNode({ data, id }: { data: { label?: string; onDuplicate: (id: string) => void; onDelete: (id: string) => void; edges?: Edge[] }; id: string }) {
  const isHandleConnected = (handleId: string, handleType: 'source' | 'target') => {
    if (!data.edges) return false;
    return data.edges.some(edge => 
      handleType === 'source' 
        ? edge.source === id && edge.sourceHandle === handleId
        : edge.target === id && edge.targetHandle === handleId
    );
  };

  const imageInputConnected = isHandleConnected('image-input', 'target');
  const imageOutputConnected = isHandleConnected('image-output', 'source');
  return (
    <div className="bg-[#212125] rounded-lg shadow-xl min-w-[220px] relative">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#212125] flex items-center justify-center">
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
      <NodeWrapper title="Crop" nodeId={id} onDuplicate={data.onDuplicate} onDelete={data.onDelete}>
      <div className="p-3">
        <div
          className="w-full h-48 rounded mb-3"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, #353539, #353539 10px, #3a3a3e 10px, #3a3a3e 20px)',
          }}
        />
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">Aspect ratio</span>
            <button className="text-gray-400 hover:text-gray-300">Reset</button>
          </div>
          <div className="flex gap-2">
            <select className="flex-1 bg-[#353539] text-[#FFFFFF] rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-gray-600">
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
                  className="w-full bg-[#353539] text-[#FFFFFF] rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-gray-600"
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="text-gray-400 text-xs opacity-0">H</label>
              <input
                type="text"
                defaultValue="1024"
                className="w-full bg-[#353539] text-[#FFFFFF] rounded px-2 py-1 text-sm mt-1 focus:outline-none focus:ring-1 focus:ring-gray-600"
              />
            </div>
          </div>
        </div>
      </div>
      </NodeWrapper>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 rounded-full bg-[#212125] flex items-center justify-center">
        <Handle 
          type="source" 
          position={Position.Right}
          id="image-output"
          className={`w-5 h-5 border-2 rounded-full flex items-center justify-center p-1`}
          style={{ position: 'relative', transform: 'none', top: 'auto', right: 'auto', left: 'auto', bottom: 'auto', borderColor: HANDLE_COLORS_HEX.image }}
        >
          <div className="rounded-full w-1 h-1 p-[2px]" style={{
            backgroundColor: imageOutputConnected ? HANDLE_COLORS_HEX.image : 'transparent'
          }} />
        </Handle>
      </div>
      <div className="absolute -right-10 top-[40%] -translate-y-1/2 text-xs text-gray-400 whitespace-nowrap">
        Image
      </div>
    </div>
  );
}
