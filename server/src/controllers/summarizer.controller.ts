import { Request, Response } from "express";
import { PDFDocumentProxy } from "pdfjs-dist";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import "pdfjs-dist/legacy/build/pdf.worker.mjs";
import { Chunk } from "../types/summarizer.type";
import { getPdfText } from "../lib/summarize";
import path from "path";
import fs from "fs";
import { summarizeText } from "../services/summarizer.service";
import db from '../models/sequelizeModel';

const Documents = db.Documents;

export const uploadContent = async (req: Request, res: Response): Promise<void> => {    
    try {
        if (!req.file) {
            res.status(400).json({ error: "No file uploaded" });
            return;
        }
        const file_name =  req.file.filename; 
        const original_name = req.file.originalname;
        const path_file = req.file.path;
        const size = req.file.size;
        const mime_type = req.file.mimetype;
        
        await Documents.create({
            original_name: original_name, file_name: file_name, path: path_file,
            size: size.toString(), mime_type: mime_type 
        });
        res.status(200).send({ 
            success : true,
            document_key: file_name,
            original_name: original_name,
        })
    } catch (error) {
        console.error('Failed to upload content:', error);
        res.status(500).send({ 
            error: 'Failed to upload content',
            details: error instanceof Error ? error.message : error
        });
    }

}


export const getSummary = async (req: Request, res: Response): Promise<void> => {    
    try {
        const {document_key} = req.params;
        const option_data = req.body.option_data;
        const filePath = path.join(process.cwd(), "uploads", "pdf", document_key);
        
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
        

        const summary = await summarizeText(fullText,option_data);
        const result = summary;
        // console.log(option_data);
        
        res.status(200).send({
            title : option_data.title,
            content : result
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Failed to summarize ',details: error instanceof Error ? error.message : error })
    }
}

export const  getListFiles = async (req: Request, res: Response): Promise<void> => {    
    try {
        const result = await Documents.findAll({
            order: [['date_creation', 'DESC']]
        });
        res.status(200).send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({ 
            error: 'Failed to retrieve list files ',details: error instanceof Error ? error.message : error})
    }
}

