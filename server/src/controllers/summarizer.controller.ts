import { Request, Response } from "express";
import { PDFDocumentProxy } from "pdfjs-dist";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import "pdfjs-dist/legacy/build/pdf.worker.mjs";
import { Chunk } from "../types/summarizer.type";
import { chunkPdf,generateSummary, summarizeStream } from "../lib/summarize";

export const summarizeContent = async (req: Request, res: Response): Promise<void> => {    
    try {
        if (!req.file) {
            res.status(400).json({ error: "No file uploaded" });
            return;
        }
        
        const arrayBuffer = new Uint8Array(req.file.buffer);
        const pdf = await getDocument({ data: arrayBuffer }).promise;
        // const localChunks = await chunkPdf(pdf);
        console.log(pdf);
        // const totalText = localChunks.reduce(
        //     (acc, chunk) => acc + chunk.text.length,
        //     0,
        // );

        // if (totalText < 500) {
        //     res.status(400).send({ error: 'Unable to process PDF. The PDF appears to be a scanned document or contains too little text to process. Please ensure the PDF contains searchable text.  ' })
        //     return;
        // }
        // const summarizedChunks: Chunk[] = [];

        // const writeStream = new WritableStream({
        //     write(chunk) {
        //         summarizedChunks.push(chunk);
        //         // return chunk.map((c:Chunk) =>
        //         //     c.text === chunk.text ? { ...c, ...chunk } : c,
        //         // );
                
        //     },
        // });

        // const stream = await summarizeStream(localChunks);
        // const controller = new AbortController();
        // await stream.pipeTo(writeStream, { signal: controller.signal });

        const finalSummary = await generateSummary(summarizedChunks);
        console.log(finalSummary);
        

        res.status(200).send({})
    } catch (error) {
        res.status(500).send({ error: 'Failed to summarize ' })
    }
}

