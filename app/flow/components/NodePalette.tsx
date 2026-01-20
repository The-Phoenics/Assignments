interface NodePaletteProps {
  onNodeDragStart: (event: React.DragEvent, nodeType: string) => void;
}

export function NodePalette({ onNodeDragStart }: NodePaletteProps) {
  const nodeTypes = [
    { type: "file", label: "File", icon: "📁" },
    { type: "text", label: "Text", icon: "📝" },
    { type: "prompt", label: "Prompt", icon: "💬" },
    { type: "crop", label: "Crop", icon: "✂️" },
    { type: "llm", label: "LLM", icon: "🤖" },
    { type: "extract", label: "Extract Frame", icon: "🎬" },
  ];

  return (
    <div className="bg-[#2a2a2a] border border-gray-700 rounded-lg p-3 shadow-xl max-w-[200px]">
      <h3 className="text-gray-300 text-sm font-semibold mb-3">Nodes</h3>
      <div className="space-y-2">
        {nodeTypes.map((node) => (
          <div
            key={node.type}
            draggable
            onDragStart={(event) => onNodeDragStart(event, node.type)}
            className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-gray-700 px-3 py-2 rounded cursor-grab active:cursor-grabbing transition-colors"
          >
            <span className="text-lg">{node.icon}</span>
            <span className="text-gray-300 text-sm">{node.label}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-3 border-t border-gray-700">
        <p className="text-xs text-gray-500">
          Drag nodes onto the canvas to add them
        </p>
      </div>
    </div>
  );
}
