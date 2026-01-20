import { useEffect, useRef } from "react";

interface NodeContextMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onDuplicate: () => void;
  onRename: () => void;
  onLock: () => void;
  onDelete: () => void;
  onRemoveCurrent: () => void;
  onRemoveAllButCurrent: () => void;
  position: { x: number; y: number };
  onDimensionsChange?: (dimensions: { width: number; height: number }) => void;
}

export function NodeContextMenu({
  isOpen,
  onClose,
  onDuplicate,
  onRename,
  onLock,
  onDelete,
  onRemoveCurrent,
  onRemoveAllButCurrent,
  position,
  onDimensionsChange,
}: NodeContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (menuRef.current && onDimensionsChange && isOpen) {
      // Use setTimeout to ensure the menu is rendered before measuring
      const timer = setTimeout(() => {
        if (menuRef.current) {
          const { width, height } = menuRef.current.getBoundingClientRect();
          onDimensionsChange({ width, height });
        }
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onDimensionsChange]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="fixed z-[9999] bg-[#2a2a2a] border border-gray-700 rounded-lg shadow-2xl py-1 w-[220px]"
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
      }}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDuplicate();
        }}
        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center justify-between transition-colors"
      >
        <span>Duplicate</span>
        <span className="text-gray-500 text-xs">ctrl+d</span>
      </button>
      
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRename();
        }}
        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
      >
        Rename
      </button>
      
      <button
        onClick={(e) => {
          e.stopPropagation();
          onLock();
        }}
        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
      >
        Lock
      </button>
      
      <div className="h-px bg-gray-700 my-1" />
      
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center justify-between transition-colors"
      >
        <span>Delete</span>
        <span className="text-gray-500 text-xs">delete / backspace</span>
      </button>
      
      <div className="h-px bg-gray-700 my-1" />
      
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemoveCurrent();
        }}
        className="w-full text-left px-4 py-2 text-sm text-gray-500 hover:bg-gray-700 transition-colors"
      >
        Remove current
      </button>
      
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemoveAllButCurrent();
        }}
        className="w-full text-left px-4 py-2 text-sm text-gray-500 hover:bg-gray-700 transition-colors"
      >
        Remove all but current
      </button>
    </div>
  );
}
