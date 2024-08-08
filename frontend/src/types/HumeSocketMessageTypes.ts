import { z } from "zod";

// Define the schema for a single Emotion object
const EmotionSchema = z.object({
  name: z.string(),
  score: z.number(),
});

export type Emotion = z.infer<typeof EmotionSchema>;

// Define the schema for a BoundingBox object
const BoundingBoxSchema = z.object({
  x: z.number(),
  y: z.number(),
  w: z.number(),
  h: z.number(),
});

// Define the schema for a Prediction object
const PredictionSchema = z.object({
  frame: z.number(),
  time: z.nullable(z.number()), // time can be null
  bbox: BoundingBoxSchema,
  prob: z.number(),
  face_id: z.string(),
  emotions: z.array(EmotionSchema),
});

export type Prediction = z.infer<typeof PredictionSchema>;

// Define the schema for the FaceData object
const FaceDataSchema = z.object({
  predictions: z.array(PredictionSchema),
});

// Define the schema for the HumeFaceEmotionRootObject
const HumeFaceEmotionRootObjectSchema = z.object({
  face: FaceDataSchema,
});

// Type for the HumeFaceEmotionRootObject
export type HumeFaceEmotionRootObject = z.infer<
  typeof HumeFaceEmotionRootObjectSchema
>;

export { HumeFaceEmotionRootObjectSchema };
