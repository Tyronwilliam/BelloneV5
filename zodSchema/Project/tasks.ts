import z from "@/zodSchema/zod";

export const TaskInterface = z.object({
  id: z.string(),
  project_id: z.number(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  start_date: z.string(),
  due_date: z.string(),
  time: z.number(),
  members: z.array(
    z.object({
      id: z.string(),
      email: z.string().email("Invalid email format"),
    })
  ),
  column_id: z.union([z.number(), z.string()]),
  order: z.number(),
  pseudo_id: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  completeAt: z.string().nullable(),
});

export type TaskInterfaceType = z.infer<typeof TaskInterface>;

export const TaskFormDialogSchema = TaskInterface.omit({
  id: true,
  project_id: true,
  title: true,
  description: true,
  due_date: true,
  column_id: true,
  members: true,
}).extend({
  member: z.string(), // Redéfinition de `members` comme une chaîne de caractères
});
export type TaskFormDialogType = z.infer<typeof TaskFormDialogSchema>;

export const StickersInterface = z.object({
  hexcode: z.string(),
  id: z.string(),
  title: z.string(),
  taskId: z.array(z.string()),
  created_at: z.date(),
  updated_at: z.date(),
});
export const StickerFormInterface = StickersInterface.omit({
  updated_at: true,
  created_at: true,
});
export type StickersType = z.infer<typeof StickersInterface>;
