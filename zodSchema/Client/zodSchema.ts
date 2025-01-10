import z from "@/zodSchema/zod";

export const ClientSchema = z.object({
  id: z.string().uuid().optional(),
  name: z
    .string()
    .min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  email: z.string().email({ message: "Email invalide" }).optional(),
  phone: z
    .string()
    .regex(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s/0-9]*$/, {
      message: "Numéro de téléphone invalide",
    })
    .optional(),
  address: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      postalCode: z.string().optional(),
      country: z.string().optional(),
    })
    .optional(),
  notes: z
    .string()
    .max(500, { message: "Les notes ne peuvent dépasser 500 caractères" })
    .optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().optional(),
});
