import multer from "multer";

// Use memoryStorage for cloud uploads (like ImageKit)
const storage = multer.memoryStorage();

// Pass the correctly spelled 'storage' variable here
const upload = multer({ storage });

export default upload;