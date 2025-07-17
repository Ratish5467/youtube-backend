import multer from "multer";
import path from "path";
import fs from "fs";


const uploadPath = path.resolve("public/temp");


if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    
    const cleanName = file.originalname.replace(/\s+/g, "_");
    cb(null, cleanName);
  },
});

export const upload = multer({ storage });
