import { NextRequest, NextResponse } from "next/server";
import { tasks, runs } from "@trigger.dev/sdk/v3";
import type { llmGeminiTask } from "@/app/trigger/llm-gemini";

export const maxDuration = 300; // 5 minutes

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { prompt, textInput, imageInput, videoInput, model, maxTokens, temperature, waitForCompletion } = body;

    // Validate required fields
    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: "Prompt is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    // Trigger the LLM task
    const handle = await tasks.trigger<typeof llmGeminiTask>(
      "llm-gemini",
      {
        prompt,
        textInput,
        imageInput,
        videoInput,
        model: model ?? "gemini-2.5-flash",
        maxTokens: maxTokens ?? 2048,
        temperature: temperature ?? 1,
      }
    );

    // If waitForCompletion is true, poll for the result
    if (waitForCompletion) {
      // Poll for completion with timeout
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
          message: "Task continues in background. Use GET /api/llm?runId={id} to check status",
        },
        { status: 408 }
      );
    }

    // Return immediately with runId
    return NextResponse.json({
      success: true,
      runId: handle.id,
      message: "Task triggered successfully. Use GET /api/llm?runId={id} to check status",
    });
  } catch (error) {
    console.error("Error in LLM API route:", error);
    
    return NextResponse.json(
      {
        error: "Failed to process LLM request",
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
    console.error("Error checking LLM task status:", error);
    
    return NextResponse.json(
      {
        error: "Failed to check task status",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
