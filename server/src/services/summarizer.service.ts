import { geminiAiClient } from "../lib/ai";
import assert from "assert";
import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";
import { OptionSchemaType } from "../types/summarizer.type";
// import { generateObject } from "ai";

// const summarySchema = z.object({
//     title: z.string().describe("A title for the summary"),
//     summary: z
//       .string()
//       .describe(
//         "The actual summary of the text containing new lines breaks between paragraphs or phrases for better readability.",
//       ),
// });

const sleep = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

const retry = async <T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> => {
  try {
    return await fn();
  } catch (error: any) {
    if (retries <= 0 || error?.status !== 503) {
      throw error;
    }
    console.warn(`Gemini overloaded, retrying in ${delay}ms...`);
    await sleep(delay);
    return retry(fn, retries - 1, delay * 2);
  }
};

export const summarizeText = async( text: string, option_data: OptionSchemaType ) => {
  
    assert.ok(typeof text === "string");
    //   assert.ok(typeof language === "string");

    const prompt = `
        You are an expert at summarizing text.

        Your task:
          - Read the text except I will provide
          - Create a ${option_data.summaryType} summary with the important points
          - The text contains page markers in the format [[PAGE_X]].Use these markers to:
            - understand page boundaries
            - reference pages accurately
            - never invent page numbers  
        
        Guidelines for the summary:
          - Pages to consider : ${option_data.pages} .
          - Languages : ${option_data.language}.
          - DO NOT write any introduction or conclusion.
          - DO NOT mention page numbers, page ranges, or future chapters.
          - DO NOT add contextual or meta explanations (e.g. "these notes cover...", "this will be explained later").
          - DO NOT explain what an algorithm is beyond what is stated in the text.
          - DO NOT invent or infer information.
          - Keep headings and subheadings with numerotations only if they reflect actual content.
          - Rewrite paragraphs
          - Preserve definitions and key distinctions.
        
        Structures rules:
          - Output only valid, clean Markdown.
          - Use:
            - ## for main sections
            - ### for subsections
            - Bullet lists where it improves clarity
      
        
        IMPORTANT: 
          - respect the guidelines and structure rules 
          
  
        
    `;
    const contents = [
        {
            role: "user",
            parts: [
                { text: prompt },
                { text: text }
            ]
        }
    ];

    return retry( async () => {
        const response = await geminiAiClient.models.generateContent({
            model: "gemini-2.5-flash",
            contents: contents,
            config: {
                thinkingConfig: {
                    thinkingBudget: 0, // Disables thinking
                },
                // responseMimeType: "application/json",
                // responseJsonSchema: zodToJsonSchema(summarySchema),
            }    
        });
        return response.text  
    })
    
    // const responseToParse = summarySchema.parse(JSON.parse(response?.text ?? ""));
    // if (!responseToParse) {
    //     console.log("Content was blank");
    //     return;
    // }
    // const title = responseToParse.title;
    // const summary = responseToParse.summary
    // console.log(content);
    // return {title,summary}
}

