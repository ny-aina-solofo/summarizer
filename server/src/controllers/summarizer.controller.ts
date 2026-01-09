import { Request, Response } from "express";

export const summarizeContent = async (req: Request, res: Response): Promise<void> => {    
    try {
        if (!req.file) {
            res.status(400).json({ error: "No file uploaded" });
            return;
        }
        // console.log(req.file);
        
        const pdfBuffer = req.file.buffer;
        const fileName = req.file.originalname;
    
        console.log("PDF received:", fileName);
        console.log("Size:", pdfBuffer.length);
 
        res.status(200).send()
    } catch (error) {
        res.status(500).send({ error: 'Failed to summarize ' })
    }
}
