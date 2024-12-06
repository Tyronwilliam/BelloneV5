import { z } from "zod";

// Zod schema for ProjectType
export const ProjectTypeSchema = z.object({
  id: z.number(), // Project ID
  title: z.string().min(1, "Title is required"), // Project title
  description: z.string().min(1, "Description is required"), // Project description
  clientId: z.string().nullable(),
  budget: z.number().nullable(),
  startDate: z.date().refine((date) => !isNaN(date.getTime()), {
    message: "Start Date is required",
  }),
  endDate: z.date().optional(),
  status: z.string().default("OPEN"),
  progress: z.number().min(0).max(100), // Project progress between 0 and 100
  creator: z.number(), // ID of the user who created the project
  time: z.number(), // Time spent on the project in seconds
  image: z.string().optional(), // Optional image URL
});

// If you want to infer the type from the schema
export const ProjectFormSchema = ProjectTypeSchema.omit({ id: true });
export type ProjectFormType = z.infer<typeof ProjectFormSchema>;

export type ProjectType = z.infer<typeof ProjectTypeSchema>;
