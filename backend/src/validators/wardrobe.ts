import {z} from "zod";

export const wardrobeValidation = {
  uploadClothItem: z.object({
    clothType: z.string().min(1, "Cloth type is required"),
    clothName: z.string().min(1, "Cloth name is required"),
  }),
};
