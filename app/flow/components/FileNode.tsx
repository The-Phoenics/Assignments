import { Handle, Position, type Edge } from "@xyflow/react";
import { useState } from "react";
import { NodeWrapper } from "./NodeWrapper";
import { HANDLES_COLORS, HANDLE_BORDER_COLORS, HANDLE_COLORS_HEX } from "@/app/lib/constants";

export function FileNode({ data, id }: { data: { label?: string; onDuplicate: (id: string) => void; onDelete: (id: string) => void; edges?: Edge[]; imageUrl?: string }; id: string }) {
  const isHandleConnected = (handleId: string, handleType: 'source' | 'target') => {
    if (!data.edges) return false;
    return data.edges.some(edge => 
      handleType === 'source' 
        ? edge.source === id && edge.sourceHandle === handleId
        : edge.target === id && edge.targetHandle === handleId
    );
  };

  const imageOutputConnected = isHandleConnected('image-output', 'source');
  const [imageUrl, setImageUrl] = useState<string | null>(data.imageUrl ?? null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  };

  return (
    <div className="bg-[#222226] rounded-lg shadow-xl min-w-[220px] relative">
      <NodeWrapper title="File" nodeId={id} onDuplicate={data.onDuplicate} onDelete={data.onDelete}>
      <div className="p-3">
        {imageUrl ? (
          <div className="relative">
            <img src={imageUrl} alt="Uploaded" className="w-full h-32 object-cover rounded" />
            <button
              onClick={() => setImageUrl(null)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
            >
              ×
            </button>
          </div>
        ) : (
          <label className="block">
            <div className="border-2 border-dashed border-gray-600 rounded bg-[#353539] h-32 flex flex-col items-center justify-center cursor-pointer hover:border-gray-500 transition-colors"
              style={{
                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.02) 10px, rgba(255,255,255,.02) 20px)',
              }}
            >
              <svg className="w-8 h-8 text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span className="text-gray-500 text-xs">Drag & drop or click to upload</span>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>
        )}
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
