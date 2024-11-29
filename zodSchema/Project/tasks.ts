import { z } from "zod";

// Zod schema for the ItemInterface
export const ItemInterface = z.object({
  id: z.string(), // Unique identifier for the item, assuming it's a string. You can adjust if it's a number or another type.
  project_id: z.number(), // Project ID, should be a number
  title: z.string(), // Title of the task/item, required as a string
  description: z.string().optional(), // Optional description of the task
  start_date: z.string(), // Start date in ISO 8601 format, assuming it's a string
  due_date: z.string(), // Due date in ISO 8601 format, assuming it's a string
  completed_at: z.string().nullable(), // Completion timestamp or null if not completed
  created_at: z.string(), // Task creation timestamp, assuming it's a string
  updated_at: z.string(), // Last updated timestamp, assuming it's a string
  time: z.number(), // Time spent on the task in seconds, a number
  stickers: z.array(z.string()), // Array for stickers, assuming each sticker is a string. Adjust this if necessary
  members: z.array(z.string()), // Array for assigned members, assuming each member is represented by a string (e.g., user ID). You can extend this if needed.
});

// If you want to infer the type from the schema, use this:
export type ItemInterfaceType = z.infer<typeof ItemInterface>;
