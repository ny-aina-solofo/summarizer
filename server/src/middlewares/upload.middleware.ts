import { Request, Response } from "express";
import multer, { FileFilterCallback } from "multer";
import path from "path";

const storage = multer.memoryStorage(); 

const fileFilter = (req:Request, file:Express.Multer.File, cb:FileFilterCallback) => {
    const filetypes = /.pdf/
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())

    if (file.mimetype !== "application/pdf" || !extname) {
        cb(new Error("Only PDF files are allowed"));
        return;
    }
    cb(null, true);
};

export const upload = multer({
    storage,
    // limits: {
    //     fileSize: 10 * 1024 * 1024, // 10 MB
    // },
    fileFilter
});
