import multer from "multer";
import path from "path";

const MAX_FILE_SIZE = 1024 * 1024 * 1024; // 1GB

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    },
});

export const upload = multer({ storage: storage, limits: { fileSize: MAX_FILE_SIZE }, });
