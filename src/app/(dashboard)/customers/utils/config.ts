import * as z from "zod";

export const staticSchema = z.object({
    name: z.string().min(1, "Name is required").max(100),
    email: z.string().email("Invalid email address").optional().or(z.literal("")),
    phone_number: z.string()
        .min(10, "Phone number must be at least 10 digits")
        .regex(/^[0-9+\-\s]+$/, "Invalid phone format")
        .optional()
        .or(z.literal("")),
    address: z.string().min(5, "Address must be at least 5 characters").max(200),
    state: z.string().min(1, "State is required"),
    city: z.string().min(1, "City is required"),
});

export type CustomerFormValues = z.infer<typeof staticSchema> & Record<string, string | number | undefined>;
