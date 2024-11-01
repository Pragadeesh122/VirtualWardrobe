import {z} from "zod";

export const collectionsValidation = {
  createCollection: z.object({
    name: z.string().min(1, "Collection name is required"),
    items: z.array(z.string()).min(1, "At least one item is required"),
  }),
};
