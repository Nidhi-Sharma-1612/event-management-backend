const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

// ✅ Configure Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "event_images", // ✅ Ensure folder name is correct
    allowed_formats: ["jpg", "png", "webp"], // ✅ Allowed image formats
    transformation: [{ width: 500, height: 500, crop: "limit" }], // ✅ Resize images
  },
});

const upload = multer({ storage });

module.exports = upload;
