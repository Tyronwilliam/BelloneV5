import z from "@/zodSchema/zod";

export const AddressSchema = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
});

export const RoleSchema = z.object({
  projectId: z.string().optional(),
  role: z.array(z.string()).optional(),
});

export const CollaboratorSchema = z.object({
  id: z.string(),
  projectId: z.array(z.string()).optional(),
  userId: z.string(),
  roles: z.array(RoleSchema).optional(),
  creator: z.string(),
  email: z.string().email().optional(), 
  phone: z.string().optional(),
  notes: z.string().optional(),
  address: AddressSchema.optional(),
});

export type CollaboratorType = z.infer<typeof CollaboratorSchema>;
