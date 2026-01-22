import express from "express";
import { getListFiles, getSummary, uploadContent } from "../controllers/summarizer.controller";
import { upload } from "../middlewares/upload.middleware";

const router = express.Router(); 

router.post('/upload-content', upload.single("pdf-file"),uploadContent);
router.post('/get-summary/:document_key', getSummary);
router.get('/get-list-files',getListFiles)


export default router;