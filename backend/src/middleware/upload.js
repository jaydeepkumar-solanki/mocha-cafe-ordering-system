
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Allowed image formats
const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp"
];

// Configure storage dynamically
const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        const type = req.params.type;

        const allowedFolders = ["product", "category"];

        if (!allowedFolders.includes(type)) {
            return cb(new Error("Invalid upload type"));
        }

        const uploadPath = path.join(
            __dirname,
            "../../uploads",
            type === "product" ? "products" : "categories"
        );

        // Create directory if it does not exist
        fs.mkdirSync(uploadPath, { recursive: true });

        cb(null, uploadPath);
    },

    filename: (req, file, cb) => {

        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1E9) +
            path.extname(file.originalname).toLowerCase();

        cb(null, uniqueName);
    }
});

// Validate image format
const fileFilter = (req, file, cb) => {

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only JPG, JPEG, PNG and WEBP images are allowed"));
    }
};

// Configure Multer
const upload = multer({

    storage: storage,

    fileFilter: fileFilter,

    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB
    }

});

module.exports = upload;
