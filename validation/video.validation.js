import { inputValid } from "./text.validation.js";
import path from "path";

export const imageVideoValidater = async (req, res, next) => {
  try {
    await inputValid.validateAsync(req.body);

    if (!req.files?.thumbnail || !req.files?.video)
      next(new Error("Any file is missing."));

    const thumbnailImage = req.files.thumbnail[0];
    const videoFile = req.files.video[0];

    const thumbnailExt = path
      .extname(thumbnailImage.originalname)
      .toString()
      .toLowerCase();
    const videoExt = path
      .extname(videoFile.originalname)
      .toString()
      .toLowerCase();

    console.log(videoExt);
    console.log(thumbnailExt);

    if (thumbnailExt !== ".jpg" && thumbnailExt !== ".png")
      next(new Error("Invalid thumbnail image type"));

    if (
      videoExt !== ".mpg" &&
      videoExt !== ".mpeg" &&
      videoExt !== ".avi" &&
      videoExt !== ".mp4"
    )
      next(new Error("Invalid video type"));

    next();
  } catch (error) {
    next(error);
  }
};
