import { z } from "zod";

export const optionSchema = z.object({
    title : z.string(),
    language : z.string(),
    summaryType : z.string(),
    pagesOptions : z.string(),
    pagesRange : z.string().optional(),
        
});

export type OptionSchemaType = z.infer<typeof optionSchema>;

