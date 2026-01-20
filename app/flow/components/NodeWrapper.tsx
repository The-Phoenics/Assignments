import { ReactNode, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { NodeContextMenu } from "./NodeContextMenu";

interface NodeWrapperProps {
  title: string;
  children: ReactNode;
  nodeId: string;
  onDuplicate: (nodeId: string) => void;
  onDelete: (nodeId: string) => void;
}

export function NodeWrapper({ title, children, nodeId, onDuplicate, onDelete }: NodeWrapperProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [menuDimensions, setMenuDimensions] = useState({ width: 220, height: 280 });

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const menuWidth = menuDimensions.width;
      const menuHeight = menuDimensions.height;
      
      // Position menu aligned to the right edge of the button, below it
      let x = rect.right - menuWidth;
      let y = rect.bottom + 4;
      
      // Ensure menu doesn't go off right edge
      const rightOverflow = (x + menuWidth) - window.innerWidth;
      if (rightOverflow > 0) {
        x = x - rightOverflow - 10;
      }
      
      // Ensure menu doesn't go off left edge
      if (x < 10) {
        x = 10;
      }
      
      // If menu would go off bottom, show it above the button instead
      const bottomOverflow = (y + menuHeight) - window.innerHeight;
      if (bottomOverflow > 0) {
        y = rect.top - menuHeight - 4;
      }
      
      // Ensure menu doesn't go off top edge
      if (y < 10) {
        y = rect.bottom + 4; // Show below even if it goes off bottom
      }
      
      setMenuPosition({ x, y });
    }
    setIsMenuOpen(!isMenuOpen);
  };

  const handleDuplicate = () => {
    onDuplicate(nodeId);
    setIsMenuOpen(false);
  };

  const handleRename = () => {
    // TODO: Implement rename functionality
    console.log("Rename node:", nodeId);
    setIsMenuOpen(false);
  };

  const handleLock = () => {
    // TODO: Implement lock functionality
    console.log("Lock node:", nodeId);
    setIsMenuOpen(false);
  };

  const handleDelete = () => {
    onDelete(nodeId);
    setIsMenuOpen(false);
  };

  const handleRemoveCurrent = () => {
    // TODO: Implement remove current functionality
    console.log("Remove current:", nodeId);
    setIsMenuOpen(false);
  };

  const handleRemoveAllButCurrent = () => {
    // TODO: Implement remove all but current functionality
    console.log("Remove all but current:", nodeId);
    setIsMenuOpen(false);
  };

  return (
    <>
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700">
        <span className="text-gray-300 text-sm font-medium">{title}</span>
        <button
          ref={buttonRef}
          onClick={handleMenuClick}
          className="text-gray-500 hover:text-gray-300 relative"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>
      {children}
      {typeof document !== "undefined" && createPortal(
        <NodeContextMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          onDuplicate={handleDuplicate}
          onRename={handleRename}
          onLock={handleLock}
          onDelete={handleDelete}
          onRemoveCurrent={handleRemoveCurrent}
          onRemoveAllButCurrent={handleRemoveAllButCurrent}
          position={menuPosition}
          onDimensionsChange={setMenuDimensions}
        />,
        document.body
      )}
    </>
  );
}
