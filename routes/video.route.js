import express from "express";
import {
  getAllVideos,
  getVideo,
  postVideo,
} from "../controllers/video.controller.js";
import singleUpload from "../middlewares/multer.js";
import { imageVideoValidater } from "../validation/video.validation.js";

const router = express.Router();

router
  .route("/")
  .post(singleUpload, imageVideoValidater, postVideo)
  .get(getAllVideos);

router.route("/:id").get(getVideo);

export default router;
