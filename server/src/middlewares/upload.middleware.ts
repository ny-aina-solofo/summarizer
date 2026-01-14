import multer from "multer";
import path from "path";
import fs from "fs";


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDest = path.join(process.cwd(), "uploads", "pdf");

    if (!fs.existsSync(uploadDest)) {
      fs.mkdirSync(uploadDest, {recursive : true});
    }
    cb(null, uploadDest); // Directory to save uploaded files
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName); // Unique filename
  }
});

export const upload = multer({
    storage,
    limits: {
        fileSize: 15 * 1024 * 1024, // 15 MB
    },
});
