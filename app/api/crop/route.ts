import { NextRequest, NextResponse } from "next/server";
import { tasks, runs } from "@trigger.dev/sdk/v3";
import type { imageCropTask } from "@/app/trigger/image-crop";

export const maxDuration = 300; // 5 minutes

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { imageUrl, imageBase64, x, y, width, height, format, quality, waitForCompletion } = body;

    // Validate required fields
    if (!imageUrl && !imageBase64) {
      return NextResponse.json(
        { error: "Either imageUrl or imageBase64 is required" },
        { status: 400 }
      );
    }

    if (width === undefined || height === undefined) {
      return NextResponse.json(
        { error: "width and height are required" },
        { status: 400 }
      );
    }

    if (width <= 0 || height <= 0) {
      return NextResponse.json(
        { error: "width and height must be positive numbers" },
        { status: 400 }
      );
    }

    // Trigger the crop task
    const handle = await tasks.trigger<typeof imageCropTask>(
      "image-crop",
      {
        imageUrl,
        imageBase64,
        x: x ?? 0,
        y: y ?? 0,
        width,
        height,
        format: format ?? "jpeg",
        quality: quality ?? 90,
      }
    );

    // If waitForCompletion is true, poll for the result
    if (waitForCompletion) {
      const maxWaitTime = 290000; // 290 seconds (leave 10s buffer)
      const pollInterval = 1000; // Poll every 1 second
      const startTime = Date.now();

      while (Date.now() - startTime < maxWaitTime) {
        const run = await runs.retrieve(handle.id);

        if (run.status === "COMPLETED") {
          return NextResponse.json({
            success: true,
            output: run.output,
            runId: run.id,
          });
        } else if (run.status === "FAILED" || run.status === "CRASHED" || run.status === "CANCELED") {
          return NextResponse.json(
            {
              error: "Task failed",
              details: `Task ended with status: ${run.status}`,
              runId: run.id,
            },
            { status: 500 }
          );
        }

        // Wait before polling again
        await new Promise(resolve => setTimeout(resolve, pollInterval));
      }

      // Timeout reached
      return NextResponse.json(
        {
          error: "Task timeout",
          details: "Task is still running but API timeout reached",
          runId: handle.id,
          message: "Task continues in background. Use GET /api/crop?runId={id} to check status",
        },
        { status: 408 }
      );
    }

    // Return immediately with runId
    return NextResponse.json({
      success: true,
      runId: handle.id,
      message: "Task triggered successfully. Use GET /api/crop?runId={id} to check status",
    });
  } catch (error) {
    console.error("Error in crop API route:", error);
    
    return NextResponse.json(
      {
        error: "Failed to process crop request",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// GET method to check task status
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const runId = searchParams.get("runId");

    if (!runId) {
      return NextResponse.json(
        { error: "runId query parameter is required" },
        { status: 400 }
      );
    }

    // Retrieve the run status
    const run = await runs.retrieve(runId);

    return NextResponse.json({
      success: true,
      runId: run.id,
      status: run.status,
      output: run.status === "COMPLETED" ? run.output : undefined,
      error: run.status === "FAILED" ? run.error : undefined,
    });
  } catch (error) {
    console.error("Error checking crop task status:", error);
    
    return NextResponse.json(
      {
        error: "Failed to check task status",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
