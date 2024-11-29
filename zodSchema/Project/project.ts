import { z } from "zod";

// Zod schema for ProjectType
export const ProjectTypeSchema = z.object({
  id: z.number(), // Project ID
  title: z.string(), // Project title
  description: z.string(), // Project description
  clientId: z.string().nullable(),
  budget: z.number().nullable(),
  startDate: z.date(),
  endDate: z.date().optional(),
  status: z.string().default("OPEN"),
  progress: z.number().min(0).max(100), // Project progress between 0 and 100
  creator: z.number(), // ID of the user who created the project
  time: z.number(), // Time spent on the project in seconds
  image: z.string().optional(), // Optional image URL
});

// If you want to infer the type from the schema
export type ProjectType = z.infer<typeof ProjectTypeSchema>;
