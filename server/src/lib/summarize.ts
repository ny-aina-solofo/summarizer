import { PDFDocumentProxy } from "pdfjs-dist";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import "pdfjs-dist/legacy/build/pdf.worker.mjs";
import { Chunk } from "../types/summarizer.type";
import { summarizeText } from "../services/summarizer.service";
import assert from "assert";

export const getPdfText = async (pdf:PDFDocumentProxy) => {
    const numPages = pdf.numPages;
    let fullText = "";

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();

        let lastY = null;
        let pageText = "";

        // Process each text item
        for (const item of textContent.items) {
        if ("str" in item) {
            // Check for new line based on Y position
            if (lastY !== null && lastY !== item.transform[5]) {
            pageText += "\n";

            // Add extra line break if there's significant vertical space
            if (lastY - item.transform[5] > 12) {
                // Adjust this threshold as needed
                pageText += "\n";
            }
            }

            pageText += item.str;
            lastY = item.transform[5];
        }
        }

        fullText += pageText + "\n\n"; // Add double newline between pages
    }

    return fullText;
}



// export  const  chunkPdf = async(pdf: PDFDocumentProxy) => {
//     // const chunkCharSize = 6000; // 100k
//     // const chunkCharSize = 100_000;
//     const maxChunkSize = 50_000;
//     // ideally have at least 4 chunks
//     // chunk size = total chars / 4 OR 100k, whichever is smaller

//     const fullText = await getPdfText(pdf);

//     const chunks: Chunk[] = [];
//     const chunkCharSize = Math.min(maxChunkSize, Math.ceil(fullText.length / 4));

//     for (let i = 0; i < fullText.length; i += chunkCharSize) {
//         const text = fullText.slice(i, i + chunkCharSize);
//         chunks.push({ text });
//     }

//     return chunks;
// }

// export const summarizeStream = async(chunks: Chunk[]) => {
//     let reading = true;
//     const stream = new ReadableStream({
//         async start(controller) {
//         const promises = chunks.map(async (chunk) => {
//             const text = chunk.text;
//             const response = await summarizeText(text);
//             let data;
//             try {
//                 data = await response;
//                 if (reading) {
//                     controller.enqueue({
//                     ...chunk,
//                     summary: data.summary,
//                     title: data.title,
//                     });
//                 }
//             } catch (e) {
//                 console.log(e);
//             }
//         });

//         await Promise.all(promises);
//         controller.close();
//         },

//         cancel() {
//             console.log("read stream canceled");
//             reading = false;
//         },
//     });

//     return stream;
// }


