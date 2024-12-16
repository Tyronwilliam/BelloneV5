import { z } from "zod";

export type TaskFormDialogType = z.infer<typeof TaskFormDialogSchema>;

export const StickersInterface = z.object({
  hexcode: z.string(),
  id: z.string(),
  title: z.string(),
  taskId: z.array(z.string()),
  created_at: z.date(),
  updated_at: z.date(),
});
export type StickersType = z.infer<typeof StickersInterface>;
// Zod schema for the ItemInterface
export const ItemInterface = z.object({
  id: z.string(), // Unique identifier for the item, assuming it's a string. You can adjust if it's a number or another type.
  project_id: z.number(), // Project ID, should be a number
  title: z.string().min(1, "Title is required"), // Title of the task/item, required as a string
  description: z.string().optional(), // Optional description of the task
  start_date: z.string(), // Start date in ISO 8601 format, assuming it's a string
  due_date: z.string(), // Due date in ISO 8601 format, assuming it's a string
  completed_at: z.string().nullable(), // Completion timestamp or null if not completed
  time: z.number(), // Time spent on the task in seconds, a number
  members: z.array(z.string()).min(1), // Array for assigned members, assuming each member is represented by a string (e.g., user ID). You can extend this if needed.
  column_id: z.union([z.number(), z.string()]),
  order: z.number(),
  pseudo_id: z.string().optional(),
});

// If you want to infer the type from the schema, use this:
export type ItemInterfaceType = z.infer<typeof ItemInterface>;
export const TaskFormDialogSchema = ItemInterface.omit({
  id: true,
  project_id: true,
  title: true,
  description: true,
  due_date: true,
  column_id: true,
});
