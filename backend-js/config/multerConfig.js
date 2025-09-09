const path = require("path");
const User = require("../Model/User");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "uploads/docs"));
    },
    filename: async (req, file, cb) => {
        try {
            const email = req.oidc.user.email;
            const user = await User.findOne({ email });

            if (!user) {
                return cb(new Error("User not found"), null);
            }

            const username = user.username;
            const ext = path.extname(file.originalname);
            const filename = `${username}${ext}`;

            user.resumeDoc = {
                filename,
                path: `/uploads/docs/${filename}`,
                mimetype: file.mimetype,
                size: file.size || 0
            };
            await user.save();

            cb(null, filename);
        } catch (err) {
            cb(err, null);
        }
    }
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