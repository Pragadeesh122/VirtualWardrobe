import {z} from "zod";

export const authValidation = {
  register: z.object({
    email: z.string().email("Invalid email format"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    displayName: z
      .string()
      .min(2, "Display name must be at least 2 characters")
      .optional(),
  }),

  login: z.object({
    email: z.string().email("Invalid email format"),
    password: z.string(),
  }),

  updateProfile: z.object({
    displayName: z.string().min(2).optional(),
    preferences: z
      .object({
        theme: z.enum(["light", "dark", "system"]).optional(),
        notifications: z.boolean().optional(),
      })
      .optional(),
  }),

  changePassword: z.object({
    currentPassword: z.string(),
    newPassword: z
      .string()
      .min(8)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
  }),
};
