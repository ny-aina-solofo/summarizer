import { z } from "zod";

export const filterSchema = z.object({
    title :  z
        .string()
        .min(5, "Bug title must be at least 5 characters.")
        .max(32, "Bug title must be at most 32 characters."),
    language : z.string(),
    summaryType : z.string(),
    pages : z.string()
        
});

export type FilterSchemaType = z.infer<typeof filterSchema>;

