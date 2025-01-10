import z from "@/zodSchema/zod";

export const TaskInterface = z.object({
  id: z.string(),
  project_id: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  start_date: z.date(),
  due_date: z.date(),
  time: z.number(),
  members: z.array(
    z.object({
      id: z.string(),
      email: z.string().email("Invalid email format"),
    })
  ),
  column_id: z.string(),
  order: z.number(),
  pseudo_id: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  completeAt: z.date().nullable(),
});

export type TaskInterfaceType = z.infer<typeof TaskInterface>;

export const TaskFormDialogSchema = TaskInterface.omit({
  id: true,
  project_id: true,
  title: true,
  description: true,
  column_id: true,
  members: true,
}).extend({
  member: z.string(), 
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
