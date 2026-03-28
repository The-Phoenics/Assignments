import { Handle, Position, type Edge } from "@xyflow/react";
import { NodeWrapper } from "./NodeWrapper";
import { HANDLES_COLORS, HANDLE_BORDER_COLORS, HANDLE_COLORS_HEX } from "@/app/lib/constants";
import { useState } from "react";

export function CropNode({ data, id }: { data: { label?: string; onDuplicate: (id: string) => void; onDelete: (id: string) => void; edges?: Edge[] }; id: string }) {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [width, setWidth] = useState(512);
  const [height, setHeight] = useState(512);
  const [imageUrl, setImageUrl] = useState("");
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState("Custom");

  const isHandleConnected = (handleId: string, handleType: 'source' | 'target') => {
    if (!data.edges) return false;
    return data.edges.some(edge => 
      handleType === 'source' 
        ? edge.source === id && edge.sourceHandle === handleId
        : edge.target === id && edge.targetHandle === handleId
    );
  };

  const handleAspectRatioChange = (ratio: string) => {
    setAspectRatio(ratio);
    
    if (ratio !== "Custom") {
      // Calculate new height based on aspect ratio
      const [w, h] = ratio.split(":").map(Number);
      const newHeight = Math.round((width * h) / w);
      setHeight(newHeight);
    }
  };

  const handleWidthChange = (newWidth: number) => {
    setWidth(newWidth);
    
    // Auto-adjust height if aspect ratio is set
    if (aspectRatio !== "Custom") {
      const [w, h] = aspectRatio.split(":").map(Number);
      const newHeight = Math.round((newWidth * h) / w);
      setHeight(newHeight);
    }
  };

  const handleCrop = async () => {
    if (!imageUrl && !croppedImage) {
      setError("Please provide an image URL first");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/crop", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: imageUrl || undefined,
          imageBase64: croppedImage || undefined,
          x,
          y,
          width,
          height,
          format: "jpeg",
          quality: 90,
          waitForCompletion: true,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setCroppedImage(result.output.imageBase64);
        setError(null);
      } else {
        setError(result.error ?? "Failed to crop image");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const imageInputConnected = isHandleConnected('image-input', 'target');
  const imageOutputConnected = isHandleConnected('image-output', 'source');
  
  return (
    <div className="bg-[#222226] rounded-lg shadow-xl min-w-[220px] relative">
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
        {/* Image Preview */}
        <div
          className="w-full h-48 rounded mb-3 relative overflow-hidden"
          style={{
            backgroundImage: croppedImage 
              ? `url(${croppedImage})`
              : 'repeating-linear-gradient(45deg, #353539, #353539 10px, #3a3a3e 10px, #3a3a3e 20px)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {isLoading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          )}
          {error && (
            <div className="absolute inset-0 bg-red-900/20 flex items-center justify-center p-2">
              <span className="text-red-400 text-xs text-center">{error}</span>
            </div>
          )}
        </div>

        {/* Image URL Input */}
        <div className="mb-3">
          <label className="text-gray-400 text-xs mb-1 block">Image URL</label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full bg-[#353539] text-white text-xs rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-gray-600"
          />
        </div>

        {/* Crop Parameters */}
        <div className="space-y-2">
          {/* Aspect Ratio */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">Aspect ratio</span>
            <button 
              onClick={() => {
                setX(0);
                setY(0);
                setWidth(512);
                setHeight(512);
                setAspectRatio("Custom");
              }}
              className="text-gray-400 hover:text-gray-300"
            >
              Reset
            </button>
          </div>
          <div className="flex gap-2">
            <select 
              value={aspectRatio}
              onChange={(e) => handleAspectRatioChange(e.target.value)}
              className="flex-1 bg-[#353539] text-white rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-gray-600"
            >
              <option>Custom</option>
              <option>16:9</option>
              <option>4:3</option>
              <option>1:1</option>
              <option>9:16</option>
              <option>3:4</option>
            </select>
          </div>

          {/* Position (X, Y) */}
          <div className="flex gap-2 text-sm">
            <div className="flex-1">
              <label className="text-gray-400 text-xs">X Position</label>
              <input
                type="number"
                value={x}
                onChange={(e) => setX(Number(e.target.value))}
                className="w-full bg-[#353539] text-white rounded px-2 py-1 text-sm mt-1 focus:outline-none focus:ring-1 focus:ring-gray-600"
              />
            </div>
            <div className="flex-1">
              <label className="text-gray-400 text-xs">Y Position</label>
              <input
                type="number"
                value={y}
                onChange={(e) => setY(Number(e.target.value))}
                className="w-full bg-[#353539] text-white rounded px-2 py-1 text-sm mt-1 focus:outline-none focus:ring-1 focus:ring-gray-600"
              />
            </div>
          </div>

          {/* Dimensions (Width, Height) */}
          <div className="flex gap-2 text-sm">
            <div className="flex-1">
              <label className="text-gray-400 text-xs">Width</label>
              <input
                type="number"
                value={width}
                onChange={(e) => handleWidthChange(Number(e.target.value))}
                className="w-full bg-[#353539] text-white rounded px-2 py-1 text-sm mt-1 focus:outline-none focus:ring-1 focus:ring-gray-600"
              />
            </div>
            <div className="flex-1">
              <label className="text-gray-400 text-xs">Height</label>
              <input
                type="number"
                value={height}
                onChange={(e) => {
                  setHeight(Number(e.target.value));
                  if (aspectRatio !== "Custom") {
                    setAspectRatio("Custom");
                  }
                }}
                className="w-full bg-[#353539] text-white rounded px-2 py-1 text-sm mt-1 focus:outline-none focus:ring-1 focus:ring-gray-600"
              />
            </div>
          </div>

          {/* Crop Button */}
          <button
            onClick={handleCrop}
            disabled={isLoading || (!imageUrl && !croppedImage)}
            className="w-full border border-gray-600 hover:border-gray-500 text-white font-medium py-2 px-4 rounded transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-3"
          >
            <span>✂️</span>
            <span>{isLoading ? "Cropping..." : "Crop Image"}</span>
          </button>
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
