import { logger, schemaTask } from "@trigger.dev/sdk/v3";
import sharp from "sharp";
import { z } from "zod";

// Schema for Crop input
const CropInputSchema = z.object({
  imageUrl: z.string().url().optional(),
  imageBase64: z.string().optional(),
  x: z.number().min(0).default(0),
  y: z.number().min(0).default(0),
  width: z.number().min(1),
  height: z.number().min(1),
  format: z.enum(["jpeg", "png", "webp"]).default("jpeg"),
  quality: z.number().min(1).max(100).default(90),
}).refine((data) => data.imageUrl ?? data.imageBase64, {
  message: "Either imageUrl or imageBase64 must be provided",
});

export type CropInput = z.infer<typeof CropInputSchema>;

// Schema for Crop output
export interface CropOutput {
  imageBase64: string;
  format: string;
  width: number;
  height: number;
  size: number;
  timestamp: string;
}

export const imageCropTask = schemaTask({
  id: "image-crop",
  schema: CropInputSchema,
  maxDuration: 300, // 5 minutes max
  retry: {
    maxAttempts: 3,
    factor: 2,
    minTimeoutInMs: 1000,
    maxTimeoutInMs: 10000,
    randomize: true,
  },
  run: async (payload): Promise<CropOutput> => {
    logger.log("Starting image crop task", {
      x: payload.x,
      y: payload.y,
      width: payload.width,
      height: payload.height,
      format: payload.format,
    });

    try {
      let imageBuffer: Buffer;

      // Get image from URL or base64
      if (payload.imageUrl) {
        logger.log("Fetching image from URL", { url: payload.imageUrl });
        const response = await fetch(payload.imageUrl);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.statusText}`);
        }
        
        const arrayBuffer = await response.arrayBuffer();
        imageBuffer = Buffer.from(arrayBuffer);
      } else if (payload.imageBase64) {
        logger.log("Processing image from base64");
        // Remove data URL prefix if present
        const base64Data = payload.imageBase64.includes('base64,')
          ? payload.imageBase64.split('base64,')[1]
          : payload.imageBase64;
        
        imageBuffer = Buffer.from(base64Data, 'base64');
      } else {
        throw new Error("No image source provided");
      }

      logger.log("Image loaded, starting crop operation");

      // Get original image metadata
      const metadata = await sharp(imageBuffer).metadata();
      logger.log("Original image metadata", {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
      });

      // Validate crop boundaries
      if (payload.x + payload.width > (metadata.width ?? 0)) {
        throw new Error(`Crop width ${payload.width} at x:${payload.x} exceeds image width ${metadata.width}`);
      }
      if (payload.y + payload.height > (metadata.height ?? 0)) {
        throw new Error(`Crop height ${payload.height} at y:${payload.y} exceeds image height ${metadata.height}`);
      }

      // Perform crop operation
      const croppedBuffer = await sharp(imageBuffer)
        .extract({
          left: Math.round(payload.x),
          top: Math.round(payload.y),
          width: Math.round(payload.width),
          height: Math.round(payload.height),
        })
        .toFormat(payload.format, {
          quality: payload.quality,
        })
        .toBuffer();

      logger.log("Crop operation completed", {
        outputSize: croppedBuffer.length,
      });

      // Get metadata of cropped image
      const croppedMetadata = await sharp(croppedBuffer).metadata();

      // Convert to base64
      const base64Image = croppedBuffer.toString('base64');
      const dataUrl = `data:image/${payload.format};base64,${base64Image}`;

      logger.log("Successfully cropped image", {
        originalSize: imageBuffer.length,
        croppedSize: croppedBuffer.length,
        width: croppedMetadata.width,
        height: croppedMetadata.height,
      });

      return {
        imageBase64: dataUrl,
        format: payload.format,
        width: croppedMetadata.width ?? payload.width,
        height: croppedMetadata.height ?? payload.height,
        size: croppedBuffer.length,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      logger.error("Error cropping image", { error });
      
      if (error instanceof Error) {
        throw new Error(`Image crop error: ${error.message}`);
      }
      
      throw new Error("Unknown error occurred while cropping image");
    }
  },
});
