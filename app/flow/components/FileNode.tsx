"use client";

import { Handle, Position, type Edge } from "@xyflow/react";
import { useState, useEffect } from "react";
import { NodeWrapper } from "./NodeWrapper";
import { HANDLE_COLORS_HEX } from "@/app/lib/constants";
import Uppy from '@uppy/core';
import Transloadit from '@uppy/transloadit';
import Dashboard from '@uppy/react/dashboard';

import '@uppy/core/css/style.css';
import '@uppy/dashboard/css/style.css';

interface UploadedFile {
  url: string;
  type: 'image' | 'video';
  thumbnail?: string;
}

export function FileNode({ data, id }: { 
  data: { 
    label?: string; 
    onDuplicate: (id: string) => void; 
    onDelete: (id: string) => void; 
    edges?: Edge[]; 
    imageUrl?: string;
    assemblyId?: string;
  }; 
  id: string 
}) {
  const isHandleConnected = (handleId: string, handleType: 'source' | 'target') => {
    if (!data.edges) return false;
    return data.edges.some(edge => 
      handleType === 'source' 
        ? edge.source === id && edge.sourceHandle === handleId
        : edge.target === id && edge.targetHandle === handleId
    );
  };

  const imageOutputConnected = isHandleConnected('image-output', 'source');

  const [uppy] = useState(() => {
    const uppyInstance = new Uppy({
      restrictions: {
        maxNumberOfFiles: 1,
        allowedFileTypes: ['image/*'],
        maxFileSize: 100 * 1024 * 1024, // 100MB
      },
      autoProceed: false,
    });

    // Configure Transloadit
    uppyInstance.use(Transloadit, {
      waitForEncoding: true,
      waitForMetadata: true,
      assemblyOptions: async () => {
        // Get signature from API for images
        const response = await fetch('/api/transloadit/signature', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileType: 'image' }),
        });

        if (!response.ok) {
          throw new Error('Failed to get Transloadit signature');
        }

        const { params, signature } = await response.json();

        return {
          params: JSON.parse(params),
          signature,
        };
      },
    });

    return uppyInstance;
  });

  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(
    data.imageUrl ? { url: data.imageUrl, type: 'image' } : null
  );

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    uppy.on('upload', () => {
      setIsUploading(true);
    });

    uppy.on('progress', (progress) => {
      setUploadProgress(progress);
    });

    uppy.on('transloadit:complete', (assembly: any) => {
      setIsUploading(false);
      console.log('Transloadit assembly complete:', assembly);

      // Get the processed results
      const results = assembly?.results;
      
      if (!results) return;

      // For images, get optimized version
      if (results.optimized && results.optimized.length > 0) {
        const file = results.optimized[0];
        setUploadedFile({
          url: file.ssl_url || file.url || '',
          type: 'image',
        });
      }
      // For videos, get encoded version and thumbnail
      else if (results.encoded && results.encoded.length > 0) {
        const video = results.encoded[0];
        const thumb = results.thumbnails?.[0];
        setUploadedFile({
          url: video.ssl_url || video.url || '',
          type: 'video',
          thumbnail: thumb?.ssl_url || thumb?.url || undefined,
        });
      }
      // Fallback to original
      else if (results[':original'] && results[':original'].length > 0) {
        const file = results[':original'][0];
        const isVideo = file.mime?.startsWith('video/');
        setUploadedFile({
          url: file.ssl_url || file.url || '',
          type: isVideo ? 'video' : 'image',
        });
      }
    });

    uppy.on('error', (error) => {
      setIsUploading(false);
      console.error('Upload error:', error);
    });

    return () => {
      // Cleanup
      uppy.cancelAll();
    };
  }, [uppy]);

  const handleRemove = () => {
    setUploadedFile(null);
    uppy.cancelAll();
  };

  return (
    <div className="bg-[#222226] rounded-lg shadow-xl min-w-[220px] relative">
      <NodeWrapper title="File" nodeId={id} onDuplicate={data.onDuplicate} onDelete={data.onDelete}>
        <div className="p-3">
          {uploadedFile ? (
            <div className="relative">
              {uploadedFile.type === 'image' ? (
                <img 
                  src={uploadedFile.url} 
                  alt="Uploaded" 
                  className="w-full h-32 object-cover rounded" 
                />
              ) : (
                <div className="relative">
                  {uploadedFile.thumbnail ? (
                    <img 
                      src={uploadedFile.thumbnail} 
                      alt="Video thumbnail" 
                      className="w-full h-32 object-cover rounded" 
                    />
                  ) : (
                    <video 
                      src={uploadedFile.url} 
                      className="w-full h-32 object-cover rounded" 
                      controls 
                    />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-black bg-opacity-50 rounded-full p-2">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}
              <button
                onClick={handleRemove}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
              >
                ×
              </button>
            </div>
          ) : (
            <div className="upload-area">
              {isUploading ? (
                <div className="border-2 border-dashed border-gray-600 rounded bg-[#353539] h-32 flex flex-col items-center justify-center">
                  <div className="w-12 h-12 border-4 border-gray-600 border-t-blue-500 rounded-full animate-spin mb-2"></div>
                  <span className="text-gray-400 text-xs">Uploading... {uploadProgress}%</span>
                </div>
              ) : (
                <Dashboard 
                  uppy={uppy}
                  height={128}
                  width="100%"
                  proudlyDisplayPoweredByUppy={false}
                  hideProgressDetails={false}
                  hideUploadButton={false}
                  note="Images only, up to 100 MB"
                  theme="dark"
                />
              )}
            </div>
          )}
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
