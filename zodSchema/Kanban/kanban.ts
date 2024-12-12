import { z } from "zod";

const KanbanSchema = z.object({
  id: z.union([z.number(), z.string()]),
  project_id: z.number().int(), // Ensuring the project_id is an integer
  image: z.string().url().optional(), // Assuming image URL must be a valid URL
  assigned_to: z.array(z.number().int()).nonempty(), // Tableau d'IDs d'utilisateurs, chacun devant être un entier
});
export type KanbanType = z.infer<typeof KanbanSchema>;
