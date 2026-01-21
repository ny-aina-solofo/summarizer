import { Request, Response } from "express";
import { PDFDocumentProxy } from "pdfjs-dist";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import "pdfjs-dist/legacy/build/pdf.worker.mjs";
import { Chunk } from "../types/summarizer.type";
import { getPdfText } from "../lib/summarize";
import path from "path";
import fs from "fs";
import { summarizeText } from "../services/summarizer.service";

export const uploadContent = async (req: Request, res: Response): Promise<void> => {    
    try {
        if (!req.file) {
            res.status(400).json({ error: "No file uploaded" });
            return;
        }
        res.status(200).send({ 
            success : true,
            document_id: req.file.filename,
            original_name: req.file.originalname,
        })
    } catch (error) {
        console.error('Failed to upload content' );
        res.status(500).send({ error: 'Failed to upload content' })
    }
}


export const getSummary = async (req: Request, res: Response): Promise<void> => {    
    try {
        const {document_id} = req.params;
        const filter_data = req.body.filter_data;
        const filePath = path.join(process.cwd(), "uploads", "pdf", document_id);
        
        if (!fs.existsSync(filePath)) {
            console.error("File not found");
            res.status(404).json({ error: "File not found" });
            return;
        }
        const file = fs.readFileSync(filePath);
        const arrayBuffer = new Uint8Array(file);
        const pdf = await getDocument({ data: arrayBuffer }).promise;
        const fullText = await getPdfText(pdf);
            
        // const localChunks = await chunkPdf(pdf);
        // const totalText = localChunks.reduce(
        //     (acc, chunk) => acc + chunk.text.length,
        //     0,
        // );

        // if (totalText < 500) {
        //     res.status(400).send({ error: 'Unable to process PDF. The PDF appears to be a scanned document or contains too little text to process. Please ensure the PDF contains searchable text.  ' })
        //     return;
        // }
        // const summarizedChunks: Chunk[] = [];
        

        const summary = await summarizeText(fullText,filter_data);
        const result = summary;
        // console.log(finalSummary);
        
        res.status(200).send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Failed to summarize ' })
    }
}

