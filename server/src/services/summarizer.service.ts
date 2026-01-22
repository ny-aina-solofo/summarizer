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
        1. Read the text except I will provide
        2. Create a ${option_data.summaryType} summary with the important points of Chapter 1 

        From subheading 1.1 to 1.5.

        In ${option_data.language}, please.
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

