import {z} from "zod";

export const wardrobeValidation = {
  uploadClothItem: z.object({
    clothType: z.string().min(1, "Cloth type is required"),
    clothName: z.string().min(1, "Cloth name is required"),
  }),
};

export const wardrobeGetItemValidation = z.object({
  userId: z.string().min(5, "userId is required to access the data"),
});
