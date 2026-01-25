import { NextResponse } from 'next/server';
import { calcSignature, getAssemblyParams, TRANSLOADIT_KEY, TRANSLOADIT_SECRET } from '@/app/lib/transloadit';

export async function POST(request: Request) {
  try {
    const { fileType } = await request.json();
    
    // Debug: Check if environment variables are loaded
    console.log('=== TRANSLOADIT DEBUG ===');
    console.log('NEXT_PUBLIC_TRANSLOADIT_KEY:', TRANSLOADIT_KEY ? `${TRANSLOADIT_KEY.substring(0, 8)}...` : 'NOT SET');
    console.log('TRANSLOADIT_SECRET:', TRANSLOADIT_SECRET ? 'SET (hidden)' : 'NOT SET');
    console.log('File type:', fileType);
    console.log('========================');
    
    if (!TRANSLOADIT_KEY) {
      return NextResponse.json(
        { error: 'NEXT_PUBLIC_TRANSLOADIT_KEY is not configured. Please add it to .env.local' },
        { status: 500 }
      );
    }
    
    if (!TRANSLOADIT_SECRET) {
      return NextResponse.json(
        { error: 'TRANSLOADIT_SECRET is not configured. Please add it to .env.local' },
        { status: 500 }
      );
    }
    
    if (!fileType || !['image', 'video'].includes(fileType)) {
      return NextResponse.json(
        { error: 'Invalid file type. Must be "image" or "video"' },
        { status: 400 }
      );
    }

    // Get assembly parameters
    const params = getAssemblyParams(fileType as 'image' | 'video');
    const paramsString = JSON.stringify(params);
    
    // Calculate signature
    const signature = calcSignature(paramsString);

    console.log('Assembly params generated successfully');
    
    return NextResponse.json({
      params: paramsString,
      signature,
    });
  } catch (error) {
    console.error('Error generating Transloadit signature:', error);
    return NextResponse.json(
      { error: 'Failed to generate signature' },
      { status: 500 }
    );
  }
}
