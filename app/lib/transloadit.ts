// Transloadit configuration and templates

export const TRANSLOADIT_KEY = process.env.NEXT_PUBLIC_TRANSLOADIT_KEY || '';
export const TRANSLOADIT_SECRET = process.env.TRANSLOADIT_SECRET || '';

// Image processing template (using Transloadit temporary storage)
export const IMAGE_TEMPLATE = {
  steps: {
    imported: {
      robot: '/upload/handle',
    },
    resized: {
      use: ':original',
      robot: '/image/resize',
      width: 1920,
      height: 1920,
      resize_strategy: 'fit',
      imagemagick_stack: 'v3.0.0',
    },
    optimized: {
      use: ['resized'],
      robot: '/image/optimize',
      progressive: true,
      preserve_meta_data: false,
    },
  },
};

// Video processing template (using Transloadit temporary storage)
export const VIDEO_TEMPLATE = {
  steps: {
    imported: {
      robot: '/upload/handle',
    },
    encoded: {
      use: ':original',
      robot: '/video/encode',
      preset: 'mp4',
      ffmpeg_stack: 'v6.0.0',
      width: 1920,
      height: 1080,
    },
    thumbnails: {
      use: ':original',
      robot: '/video/thumbs',
      count: 1,
      format: 'jpg',
    },
  },
};

// Generate assembly parameters for Transloadit
export function getAssemblyParams(fileType: 'image' | 'video') {
  const template = fileType === 'image' ? IMAGE_TEMPLATE : VIDEO_TEMPLATE;
  
  // Debug logging
  console.log('TRANSLOADIT_KEY loaded:', TRANSLOADIT_KEY ? `${TRANSLOADIT_KEY.substring(0, 8)}...` : 'EMPTY!');
  
  if (!TRANSLOADIT_KEY) {
    console.error('WARNING: NEXT_PUBLIC_TRANSLOADIT_KEY is not set!');
  }
  
  return {
    auth: {
      key: TRANSLOADIT_KEY,
      expires: new Date(Date.now() + 3600000).toISOString(), // 1 hour
    },
    template_id: process.env.NEXT_PUBLIC_TRANSLOADIT_TEMPLATE_ID || undefined,
    steps: !process.env.NEXT_PUBLIC_TRANSLOADIT_TEMPLATE_ID ? template.steps : undefined,
  };
}

// Calculate signature for Transloadit (server-side only)
export function calcSignature(params: string): string {
  if (typeof window !== 'undefined') {
    throw new Error('calcSignature must only be called server-side');
  }
  
  // Debug logging
  console.log('TRANSLOADIT_SECRET loaded:', TRANSLOADIT_SECRET ? 'YES (hidden)' : 'EMPTY!');
  
  if (!TRANSLOADIT_SECRET) {
    console.error('WARNING: TRANSLOADIT_SECRET is not set!');
  }
  
  const crypto = require('crypto');
  const signature = crypto
    .createHmac('sha384', TRANSLOADIT_SECRET)
    .update(Buffer.from(params, 'utf-8'))
    .digest('hex');
  
  return signature;
}
