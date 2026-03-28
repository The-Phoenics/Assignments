import { logger, schemaTask } from "@trigger.dev/sdk/v3";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";

// Schema for LLM input
const LLMInputSchema = z.object({
  prompt: z.string().min(1, "Prompt cannot be empty"),
  textInput: z.string().optional(),
  imageInput: z.string().optional(), // Base64 encoded image or URL
  videoInput: z.string().optional(), // URL to video
  model: z.string().default("gemini-2.5-flash"), // Free tier model
  maxTokens: z.number().optional().default(2048),
  temperature: z.number().min(0).max(2).optional().default(1),
});

export type LLMInput = z.infer<typeof LLMInputSchema>;

// Schema for LLM output
export interface LLMOutput {
  text: string;
  model: string;
  timestamp: string;
  tokensUsed?: number;
}

export const llmGeminiTask = schemaTask({
  id: "llm-gemini",
  schema: LLMInputSchema,
  maxDuration: 300, // 5 minutes max
  retry: {
    maxAttempts: 3,
    factor: 2,
    minTimeoutInMs: 1000,
    maxTimeoutInMs: 10000,
    randomize: true,
  },
  run: async (payload): Promise<LLMOutput> => {
    logger.log("Starting LLM Gemini task", { payload });

    // Get API key from environment
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      logger.error("GEMINI_API_KEY environment variable not set");
      throw new Error("GEMINI_API_KEY environment variable is required");
    }

    try {
      // Initialize Gemini AI
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: payload.model });

      // Build the prompt with context
      let fullPrompt = payload.prompt;
      
      if (payload.textInput) {
        fullPrompt += `\n\nText Input:\n${payload.textInput}`;
      }

      logger.log("Generating content with Gemini", { 
        model: payload.model,
        promptLength: fullPrompt.length,
        hasImage: !!payload.imageInput,
        hasVideo: !!payload.videoInput,
      });

      // Handle multimodal inputs if present
      let result;
      
      if (payload.imageInput || payload.videoInput) {
        // Multimodal generation
        const parts: Array<string | { inlineData: { data: string; mimeType: string } }> = [fullPrompt];
        
        if (payload.imageInput) {
          // Assume base64 encoded image
          const imageData = payload.imageInput.includes('base64,') 
            ? payload.imageInput.split('base64,')[1]
            : payload.imageInput;
          
          parts.push({
            inlineData: {
              data: imageData,
              mimeType: "image/jpeg", // You might want to detect this
            },
          });
        }

        result = await model.generateContent(parts);
      } else {
        // Text-only generation
        result = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
          generationConfig: {
            maxOutputTokens: payload.maxTokens,
            temperature: payload.temperature,
          },
        });
      }

      const response = result.response;
      const text = response.text();

      logger.log("Successfully generated content", { 
        responseLength: text.length,
      });

      return {
        text,
        model: payload.model,
        timestamp: new Date().toISOString(),
        tokensUsed: response.usageMetadata?.totalTokenCount,
      };
    } catch (error) {
      logger.error("Error generating content with Gemini", { error });
      
      if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
      }
      
      throw new Error("Unknown error occurred while generating content");
    }
  },
});
