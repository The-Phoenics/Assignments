import { Handle, Position, type Edge } from "@xyflow/react";
import { NodeWrapper } from "./NodeWrapper";
import { HANDLE_COLORS_HEX } from "@/app/lib/constants";

export function PromptNode({ data, id }: { data: { label?: string; text?: string; onDuplicate: (id: string) => void; onDelete: (id: string) => void; edges?: Edge[] }; id: string }) {
  const isHandleConnected = (handleId: string, handleType: 'source' | 'target') => {
    if (!data.edges) return false;
    return data.edges.some(edge =>
      handleType === 'source' 
        ? edge.source === id && edge.sourceHandle === handleId
        : edge.target === id && edge.targetHandle === handleId
    );
  };

  const promptOutputConnected = isHandleConnected('prompt-output', 'source');
  return (
    <div className="bg-[#222226] rounded-lg shadow-xl w-[280px] relative">
      <NodeWrapper title="Prompt" nodeId={id} onDuplicate={data.onDuplicate} onDelete={data.onDelete}>
      <div className="p-3">
        <textarea
          className="w-full bg-[#353539] text-[#FFFFFF] rounded px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-gray-600 overflow-hidden"
          placeholder="Enter your prompt here..."
          defaultValue={data.text ?? ""}
          rows={6}
          onInput={(e) => {
            e.currentTarget.style.height = 'auto';
            e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
          }}
        />
      </div>
      </NodeWrapper>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 rounded-full bg-[#212125] flex items-center justify-center">
        <Handle 
          type="source" 
          position={Position.Right}
          id="prompt-output"
          className={`w-5 h-5 border-2 rounded-full flex items-center justify-center p-1`}
          style={{ position: 'relative', transform: 'none', top: 'auto', right: 'auto', left: 'auto', bottom: 'auto', borderColor: HANDLE_COLORS_HEX.prompt }}
        >
          <div className="rounded-full w-1 h-1 p-[2px]" style={{
            backgroundColor: promptOutputConnected ? HANDLE_COLORS_HEX.prompt : 'transparent'
          }} />
        </Handle>
      </div>
      <div className="absolute -right-16 top-[40%] -translate-y-1/2 text-xs text-gray-400 whitespace-nowrap">
        Prompt
      </div>
    </div>
  );
}
