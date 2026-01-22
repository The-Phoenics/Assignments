import { Handle, Position } from "@xyflow/react";
import { NodeWrapper } from "./NodeWrapper";

export function PromptNode({ data, id }: { data: { label?: string; text?: string; onDuplicate: (id: string) => void; onDelete: (id: string) => void }; id: string }) {
  return (
    <div className="bg-[#212125] rounded-lg shadow-xl min-w-[20px] relative">
      <NodeWrapper title="Prompt" nodeId={id} onDuplicate={data.onDuplicate} onDelete={data.onDelete}>
      <div className="p-3">
        <div className="bg-[#353539] text-[#FFFFFF] rounded px-3 py-2 text-sm min-h-[150px]">
          {data.text ?? "Hipster Sisyphus, lime dots overall suit, pushing a huge round rock up a hill. The rock is sprayed with the text 'default prompt', bright gray background extreme side long shot, cinematic, fashion style, side view"}
        </div>
      </div>
      </NodeWrapper>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 rounded-full bg-[#212125] flex items-center justify-center">
        <Handle 
          type="source" 
          position={Position.Right} 
          className="w-5 h-5 bg-pink-500 border-2 border-white rounded-full"
          style={{ position: 'relative', transform: 'none', top: 'auto', right: 'auto', left: 'auto', bottom: 'auto' }}
        />
      </div>
      <div className="absolute -right-16 top-[40%] -translate-y-1/2 text-xs text-gray-400 whitespace-nowrap">
        Prompt
      </div>
    </div>
  );
}
