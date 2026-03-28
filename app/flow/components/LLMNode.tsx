import { Handle, Position, type Edge } from "@xyflow/react";
import { NodeWrapper } from "./NodeWrapper";
import { HANDLE_COLORS_HEX } from "@/app/lib/constants";
import { useState } from "react";

export function LLMNode({ data, id }: { data: { label?: string; onDuplicate: (id: string) => void; onDelete: (id: string) => void; edges?: Edge[] }; id: string }) {
  const [prompt, setPrompt] = useState("Describe what you see in detail.");
  const [generatedText, setGeneratedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
  
  const handleRunModel = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/llm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          waitForCompletion: true,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setGeneratedText(result.output.text);
      } else {
        setError(result.error ?? "Failed to generate text");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

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
        <div className="mb-3">
          <label className="text-gray-400 text-xs mb-1 block">Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full bg-[#353539] text-white text-sm rounded p-2 border border-gray-600 focus:border-gray-500 outline-none resize-none"
            rows={2}
            placeholder="Enter your prompt..."
          />
        </div>
        <div className="w-full h-48 rounded bg-[#353539] flex items-center justify-center mb-3 p-3 overflow-auto">
          {isLoading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              <span className="text-gray-400 text-sm">Generating...</span>
            </div>
          ) : error ? (
            <div className="text-red-400 text-sm text-center">
              <div className="font-medium mb-1">Error</div>
              <div className="text-xs">{error}</div>
            </div>
          ) : generatedText ? (
            <div className="text-white text-sm whitespace-pre-wrap w-full h-full overflow-auto">
              {generatedText}
            </div>
          ) : (
            <span className="text-gray-500 text-sm">The generated text will appear here</span>
          )}
        </div>
        <button 
          onClick={handleRunModel}
          disabled={isLoading || !prompt.trim()}
          className="w-full border border-gray-600 hover:border-gray-500 text-white font-medium py-2 px-4 rounded transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>→</span>
          <span>{isLoading ? "Running..." : "Run Model"}</span>
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
