import { z } from "zod";

export const ProjectSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().optional(),
  startDate: z.date(),
  endDate: z.date().optional(),
  status: z.string().default("OPEN"),
  budget: z.number().nullable(),
  clientId: z.string().nullable(),
});
