import { Handle, Position } from "@xyflow/react";
import { useState } from "react";

export function FileNode({ data }: { data: { label?: string } }) {
  const [imageUrl, setImageUrl] = useState<string | null>(data.imageUrl ?? null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  };

  return (
    <div className="bg-[#2a2a2a] rounded-lg shadow-xl border border-gray-700 min-w-[220px]">
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-pink-500 border-2 border-white" />
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700">
        <span className="text-gray-300 text-sm font-medium">File</span>
        <button className="text-gray-500 hover:text-gray-300">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>
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
            <div className="border-2 border-dashed border-gray-600 rounded bg-[#1a1a1a] bg-opacity-50 h-32 flex flex-col items-center justify-center cursor-pointer hover:border-gray-500 transition-colors"
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
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-pink-500 border-2 border-white" />
    </div>
  );
}
