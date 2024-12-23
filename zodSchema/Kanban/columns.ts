import { z } from "zod";
export const ColumnsTypeSchema = z.object({
  id: z.union([z.number(), z.string()]),
  title: z.string().min(1, "Title is required"), // Project title
  color: z.string(),
  project_id: z.union([z.number(), z.string()]),
  order: z.number(), // Adding an order field to control the position of the column
});
export type ColumnsType = z.infer<typeof ColumnsTypeSchema>;
