import multer from "multer";

const storage = multer.memoryStorage();

const singleUpload = multer({ storage }).fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "video", maxCount: 1 },
]);

export default singleUpload;
