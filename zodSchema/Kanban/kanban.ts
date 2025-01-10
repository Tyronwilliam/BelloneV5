import z from "@/zodSchema/zod";

const KanbanSchema = z.object({
  id: z.union([z.number(), z.string()]),
  project_id: z.number().int(),
  image: z.string().url().optional(),
  assigned_to: z.array(z.number().int()).nonempty(),
});
export type KanbanType = z.infer<typeof KanbanSchema>;
