import {z} from "zod";

export const suggestionValidation = z.object({
  userId: z.string(),
  selectedItems: z.array(z.string()),
  preferences: z.object({
    occasion: z.array(z.string()),
    style: z.array(z.string()),
    season: z.array(z.string()),
    colorPreference: z.array(z.string()),
    dresscode: z.array(z.string()),
  }),
});
