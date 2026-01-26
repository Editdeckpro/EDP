import { z } from "zod";

export const audioUploadSchema = z.object({
  audio: z.instanceof(File).refine(
    (file) => file.size <= 50 * 1024 * 1024,
    "Audio file size must be less than 50MB"
  ).refine(
    (file) => ["audio/mpeg", "audio/mp3", "audio/wav", "audio/wave", "audio/x-wav"].includes(file.type) ||
             file.name.endsWith(".mp3") || file.name.endsWith(".wav"),
    "Only MP3 and WAV files are supported"
  ),
});

export const createLyricVideoSchema = z.object({
  audioId: z.string().min(1, "Audio ID is required"),
  lyrics: z.string().min(1, "Lyrics are required"),
  style: z.string().optional(),
  font: z.string().optional(),
  textColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color format").optional(),
  highlightColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color format").optional(),
  backgroundColor: z.string().optional(),
  backgroundImage: z.string().optional(),
});

export const updateTimingSchema = z.object({
  words: z.array(z.object({
    word: z.string(),
    startTime: z.number().min(0),
    endTime: z.number().min(0),
    lineIndex: z.number().int().min(0),
    wordIndex: z.number().int().min(0),
    isHighlighted: z.boolean().optional(),
  })),
});

export const generateFinalVideoSchema = z.object({
  aspectRatio: z.enum(["1:1", "9:16", "16:9"]).default("16:9"),
});

export type AudioUploadSchemaType = z.infer<typeof audioUploadSchema>;
export type CreateLyricVideoSchemaType = z.infer<typeof createLyricVideoSchema>;
export type UpdateTimingSchemaType = z.infer<typeof updateTimingSchema>;
export type GenerateFinalVideoSchemaType = z.infer<typeof generateFinalVideoSchema>;
