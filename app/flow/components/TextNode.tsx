import { Handle, Position } from "@xyflow/react";
import { NodeWrapper } from "./NodeWrapper";
import { HANDLES_COLORS } from "@/app/lib/constants";

export function TextNode({ data, id }: { data: { label?: string; text?: string; onDuplicate: (id: string) => void; onDelete: (id: string) => void }; id: string }) {
  return (
    <div className="bg-[#212125] rounded-lg shadow-xl min-w-[220px] relative">
      <NodeWrapper title="Text" nodeId={id} onDuplicate={data.onDuplicate} onDelete={data.onDelete}>
      <div className="p-3">
        <textarea
          className="w-full h-24 bg-[#353539] text-[#FFFFFF] rounded px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-gray-600"
          placeholder="Text here..."
          defaultValue={data.text ?? ""}
        />
      </div>
      </NodeWrapper>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 rounded-full bg-[#212125] flex items-center justify-center">
        <Handle 
          type="source" 
          position={Position.Right}
          id="text-output"
          className={`w-5 h-5 ${HANDLES_COLORS.text} border-2 border-white rounded-full`}
          style={{ position: 'relative', transform: 'none', top: 'auto', right: 'auto', left: 'auto', bottom: 'auto' }}
        />
      </div>
      <div className="absolute -right-10 top-[40%] -translate-y-1/2 text-xs text-gray-400 whitespace-nowrap">
        Text
      </div>
    </div>
  );
}
