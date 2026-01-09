import express from "express";
import { summarizeContent } from "../controllers/summarizer.controller";
import { upload } from "../middlewares/upload.middleware";

const router = express.Router(); 

router.post('/summarize-content', upload.single("pdf-file"),summarizeContent);



export default router;