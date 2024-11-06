import {z} from "zod";

export const calendarValidation = {
  createOutfitLog: z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    collectionId: z.string(),
  }),

  getOutfitLogs: z.object({
    userId: z.string(),
  }),
};
