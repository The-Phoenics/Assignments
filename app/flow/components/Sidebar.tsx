"use client";

import { useState } from "react";

interface SidebarProps {
  onNodeDragStart?: (event: React.DragEvent, nodeType: string) => void;
}

export function Sidebar({ onNodeDragStart }: SidebarProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const nodeTypes = [
    { type: "file", label: "File", icon: "📁" },
    { type: "video", label: "Video", icon: "🎥" },
    { type: "text", label: "Text", icon: "📝" },
    { type: "prompt", label: "Prompt", icon: "💬" },
    { type: "crop", label: "Crop", icon: "✂️" },
    { type: "llm", label: "Any LLM", icon: "🤖" },
    { type: "extract", label: "Extract Video Frame", icon: "🎬" },
  ];

  return (
    <>
      {/* Left Icon Sidebar - Always 52px */}
      <div className="fixed left-0 top-0 h-full w-[52px] bg-[#1e1e1e] border-r border-gray-800 z-50 pointer-events-auto">
        {/* Header */}
        <div className="flex items-center justify-center h-14 border-b border-gray-800">
          <button
            onClick={() => setActiveSection(null)}
            className="flex items-center gap-2 text-white hover:bg-gray-800 p-2 rounded transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 6h18v2H3V6m0 5h18v2H3v-2m0 5h18v2H3v-2z" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col h-[calc(100%-3.5rem)] overflow-y-auto">
          {/* Top icons */}
          <div className="flex flex-col border-b border-gray-800">
            {/* Search */}
            <button
              onClick={() => toggleSection("search")}
              className={`flex items-center justify-center h-12 text-gray-400 hover:bg-gray-800 transition-colors ${
                activeSection === "search" ? "bg-gray-800" : ""
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Quick Access - Recent/History */}
            <button
              onClick={() => toggleSection("quickaccess")}
              className={`flex items-center justify-center h-12 transition-colors ${
                activeSection === "quickaccess" 
                  ? "bg-[#F7FFA8] text-gray-800" 
                  : "text-gray-400 hover:bg-gray-800"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>

            {/* Briefcase/Projects */}
            <button
              onClick={() => toggleSection("projects")}
              className={`flex items-center justify-center h-12 text-gray-400 hover:bg-gray-800 transition-colors ${
                activeSection === "projects" ? "bg-gray-800" : ""
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </button>

            {/* External link */}
            <button
              onClick={() => toggleSection("external")}
              className={`flex items-center justify-center h-12 text-gray-400 hover:bg-gray-800 transition-colors ${
                activeSection === "external" ? "bg-gray-800" : ""
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>

            {/* Share */}
            <button
              onClick={() => toggleSection("share")}
              className={`flex items-center justify-center h-12 text-gray-400 hover:bg-gray-800 transition-colors ${
                activeSection === "share" ? "bg-gray-800" : ""
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>

            {/* 3D Cube */}
            <button
              onClick={() => toggleSection("cube")}
              className={`flex items-center justify-center h-12 text-gray-400 hover:bg-gray-800 transition-colors ${
                activeSection === "cube" ? "bg-gray-800" : ""
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </button>

            {/* Settings/Adjustments */}
            <button
              onClick={() => toggleSection("settings")}
              className={`flex items-center justify-center h-12 text-gray-400 hover:bg-gray-800 transition-colors ${
                activeSection === "settings" ? "bg-gray-800" : ""
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Content Panel - Slides from left */}
      <div
        className={`fixed left-[52px] top-0 h-full bg-[#1e1e1e] border-r border-gray-800 transition-all duration-300 ease-in-out z-50 pointer-events-auto ${
          activeSection ? "w-[243px] opacity-100" : "w-0 opacity-0 pointer-events-none"
        } overflow-hidden`}
      >
        {activeSection === "search" && (
          <div className="w-[243px] h-full p-4">
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-[#2a2a2a] text-gray-300 text-sm px-3 py-2 rounded outline-none"
              autoFocus
            />
          </div>
        )}

        {activeSection === "quickaccess" && (
          <div className="w-[243px] h-full overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between h-14 px-4 border-b border-gray-800">
              <span className="text-sm text-gray-400">untitled</span>
            </div>

            {/* Quick Access */}
            <div className="p-4">
              <h3 className="text-white text-sm font-semibold mb-3">Quick access</h3>
              <div className="grid grid-cols-2 gap-2">
                {nodeTypes.map((node) => (
                  <div
                    key={node.type}
                    draggable
                    onDragStart={(event) => {
                      event.dataTransfer.setData("application/reactflow", node.type);
                      event.dataTransfer.effectAllowed = "move";
                    }}
                    className="flex flex-col items-center justify-center h-20 bg-[#2a2a2a] hover:bg-gray-700 rounded border border-gray-700 transition-colors cursor-grab active:cursor-grabbing"
                  >
                    <span className="text-xl mb-1">{node.icon}</span>
                    <span className="text-xs text-gray-300 text-center px-1">{node.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Toolbox */}
            {/* <div className="px-4 pb-4">
              <h3 className="text-white text-sm font-semibold mb-2">Toolbox</h3>
              <div className="mb-3">
                <h4 className="text-gray-400 text-xs mb-2">Editing</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button className="flex flex-col items-center justify-center h-20 bg-[#2a2a2a] hover:bg-gray-700 rounded border border-gray-700 transition-colors">
                    <span className="text-xl mb-1">≈</span>
                    <span className="text-xs text-gray-300">Levels</span>
                  </button>
                  <button className="flex flex-col items-center justify-center h-20 bg-[#2a2a2a] hover:bg-gray-700 rounded border border-gray-700 transition-colors">
                    <span className="text-xl mb-1">⊞</span>
                    <span className="text-xs text-gray-300">Compositor</span>
                  </button>
                  <button className="flex flex-col items-center justify-center h-20 bg-[#2a2a2a] hover:bg-gray-700 rounded border border-gray-700 transition-colors">
                    <span className="text-xl mb-1">🖌</span>
                    <span className="text-xs text-gray-300">Painter</span>
                  </button>
                  <button className="flex flex-col items-center justify-center h-20 bg-[#2a2a2a] hover:bg-gray-700 rounded border border-gray-700 transition-colors">
                    <span className="text-xl mb-1">⊡</span>
                    <span className="text-xs text-gray-300">Crop</span>
                  </button>
                </div>
              </div>
            </div> */}
          </div>
        )}

        {activeSection === "projects" && (
          <div className="w-[243px] h-full p-4">
            <h3 className="text-white text-sm font-semibold mb-3">Projects</h3>
            <p className="text-gray-500 text-sm">No projects yet</p>
          </div>
        )}

        {activeSection === "settings" && (
          <div className="w-[243px] h-full p-4">
            <h3 className="text-white text-sm font-semibold mb-3">Settings</h3>
            <p className="text-gray-500 text-sm">Settings panel</p>
          </div>
        )}
      </div>
    </>
  );
}
