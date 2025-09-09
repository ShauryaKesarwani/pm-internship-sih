const path = require("path");
const User = require("../Model/User");
const multer = require("multer");
const fs = require("fs");

const uploadDir = path.join(__dirname, "..", "uploads", "docs");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: async (req, file, cb) => {
        const user = await User.findOne({ email: req.oidc.user.email });
        if (!user) return cb(new Error("User not found"), null);

        const ext = path.extname(file.originalname);
        const filename = `${user.username}${ext}`;

        user.resumeDoc = {
            filename,
            path: `/uploads/docs/${filename}`,
            mimetype: file.mimetype,
            size: file.size,
        };
        await user.save();
        cb(null, filename);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only PDF, DOC, and DOCX files are allowed!"), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 15 * 1024 * 1024 },
});

module.exports = upload;