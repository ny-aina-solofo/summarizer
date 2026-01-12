import { Request, Response } from "express";
import { PDFDocumentProxy } from "pdfjs-dist";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import "pdfjs-dist/legacy/build/pdf.worker.mjs";
import { Chunk } from "../types/summarizer";

export const summarizeContent = async (req: Request, res: Response): Promise<void> => {    
    try {
        if (!req.file) {
            res.status(400).json({ error: "No file uploaded" });
            return;
        }
        
        const arrayBuffer = new Uint32Array(req.file.buffer);
        const pdf = await getDocument({ data: arrayBuffer }).promise;
         const localChunks = await chunkPdf(pdf);
        // console.log(localChunks);
        
        // const pdfBuffer = req.file.buffer;
        // const fileName = req.file.originalname;
    
        // console.log("PDF received:", fileName);
        // console.log("Size:", pdfBuffer.length);
 

        res.status(200).send()
    } catch (error) {
        res.status(500).send({ error: 'Failed to summarize ' })
    }
}

const getPdfText = async (pdf:PDFDocumentProxy) => {
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



const  chunkPdf = async(pdf: PDFDocumentProxy) => {
  // const chunkCharSize = 6000; // 100k
  // const chunkCharSize = 100_000;
  const maxChunkSize = 50_000;
  // ideally have at least 4 chunks
  // chunk size = total chars / 4 OR 100k, whichever is smaller

  const fullText = await getPdfText(pdf);

  const chunks: Chunk[] = [];
  const chunkCharSize = Math.min(maxChunkSize, Math.ceil(fullText.length / 4));

  for (let i = 0; i < fullText.length; i += chunkCharSize) {
    const text = fullText.slice(i, i + chunkCharSize);
    chunks.push({ text });
  }

  return chunks;
}