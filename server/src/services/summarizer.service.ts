import { geminiAiClient } from "../lib/ai";
import assert from "assert";
import dedent from "dedent";
import { z } from "zod";
// import { generateObject } from "ai";

const summarySchema = z.object({
    title: z.string().describe("A title for the summary"),
    summary: z
      .string()
      .describe(
        "The actual summary of the text containing new lines breaks between paragraphs or phrases for better readability.",
      ),
});

export const summarizeText = async( text: string ) => {
  
    assert.ok(typeof text === "string");
    //   assert.ok(typeof language === "string");

    const prompt = dedent`
        You are an expert at summarizing text.

        Your task:
        1. Read the document excerpt I will provide
        2. Create a concise summary
        3. Generate a short, descriptive title

        Guidelines for the summary:
        - Format the summary in HTML
        - Use <p> tags for paragraphs (2-3 sentences each)
        - Use <ul> and <li> tags for bullet points
        - Use <h3> tags for subheadings when needed but don't repeat the initial title in the first paragraph
        - Ensure proper spacing with appropriate HTML tags

        The summary should be well-structured and easy to scan, while maintaining accuracy and completeness.
        Please analyze the text thoroughly before starting the summary.

        IMPORTANT: Output ONLY valid HTML without any markdown or plain text line breaks.
        JSON format EXACTLY:
        {
            "title": "string",
            "summary": "string (HTML only)"
        }
    `;

    
    const response = await geminiAiClient.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            thinkingConfig: {
                thinkingBudget: 0, // Disables thinking
            },
            responseMimeType: "application/json",
            responseJsonSchema: zodToJsonSchema(summarySchema),
        }    
    });
    
    const responseToParse = summarySchema.parse(JSON.parse(response?.text ?? ""));
    if (!responseToParse) {
        console.log("Content was blank");
        return;
    }
    const title = responseToParse.title;
    const summary = responseToParse.summary
    // console.log(content);
    return {title,summary}  
}

// export const runtime = "edge";