import z from "@/zodSchema/zod";

export const ProjectTypeSchema = z.object({
  id: z.union([z.number(), z.string()]),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"), 
  clientId: z.string().nullable(),
  budget: z.number().nullable(),
  startDate: z.date().refine((date) => !isNaN(date.getTime()), {
    message: "Start Date is required",
  }),
  endDate: z.date().optional(),
  status: z.string().default("OPEN"),
  progress: z.number().min(0).max(100), 
  creator: z.number(), 
  time: z.number(),
  image: z.string().optional(), 
});

export const ProjectFormSchema = ProjectTypeSchema.omit({ id: true });
export type ProjectFormType = z.infer<typeof ProjectFormSchema>;

export type ProjectType = z.infer<typeof ProjectTypeSchema>;
