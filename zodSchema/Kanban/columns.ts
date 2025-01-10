import z from "@/zodSchema/zod";
export const ColumnsTypeSchema = z.object({
  id: z.union([z.number(), z.string()]),
  title: z.string().min(1, "Title is required"), 
  color: z.string(),
  project_id: z.union([z.number(), z.string()]),
  order: z.number(), 
  pseudo_id: z.string().optional(),
});
export type ColumnsType = z.infer<typeof ColumnsTypeSchema>;
