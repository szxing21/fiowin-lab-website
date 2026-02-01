import { z } from "zod";
import { storagePut } from "./storage";
import { publicProcedure, router } from "./_core/trpc";

/**
 * Upload file to S3 and return the public URL
 * Input: base64 encoded file data
 * Output: public URL
 */
export const uploadRouter = router({
  uploadImage: publicProcedure
    .input(
      z.object({
        file: z.string(), // base64 encoded file data
        filename: z.string(),
        contentType: z.string().default("image/jpeg"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Decode base64 to buffer
        const buffer = Buffer.from(input.file, "base64");
        
        // Generate unique filename with timestamp
        const timestamp = Date.now();
        const randomSuffix = Math.random().toString(36).substring(2, 8);
        const fileKey = `images/${timestamp}-${randomSuffix}-${input.filename}`;
        
        // Upload to S3
        const { url } = await storagePut(fileKey, buffer, input.contentType);
        
        return {
          success: true,
          url,
          key: fileKey,
        };
      } catch (error) {
        console.error("Upload error:", error);
        throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    }),

  /**
   * Upload multiple images
   */
  uploadImages: publicProcedure
    .input(
      z.object({
        files: z.array(
          z.object({
            file: z.string(), // base64 encoded
            filename: z.string(),
            contentType: z.string().default("image/jpeg"),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const uploadPromises = input.files.map(async (fileData) => {
          const buffer = Buffer.from(fileData.file, "base64");
          const timestamp = Date.now();
          const randomSuffix = Math.random().toString(36).substring(2, 8);
          const fileKey = `images/${timestamp}-${randomSuffix}-${fileData.filename}`;
          
          const { url } = await storagePut(fileKey, buffer, fileData.contentType);
          return { url, key: fileKey };
        });

        const results = await Promise.all(uploadPromises);
        
        return {
          success: true,
          urls: results.map((r) => r.url),
          keys: results.map((r) => r.key),
        };
      } catch (error) {
        console.error("Batch upload error:", error);
        throw new Error(`Failed to upload images: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    }),
});
