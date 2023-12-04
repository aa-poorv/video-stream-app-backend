import { convertAVIToMP4 } from "../Convertor/convertor.js";
import Video from "../models/video.model.js";
import getDataUriParser from "../utils/dataUri.js";
import cloudinary from "cloudinary";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import streamifier from "streamifier";

export const postVideo = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const thumbnailImage = req.files.thumbnail[0];
    const videoFile = req.files.video[0];
    const fileType = path
      .extname(videoFile.originalname)
      .toString()
      .toLowerCase()
      .split(".")[1];

    console.log(fileType);
    let videoCloud;

    if (fileType === "mp4") {
      const videoUri = getDataUriParser(videoFile);
      videoCloud = await cloudinary.v2.uploader.upload(videoUri.content, {
        resource_type: "auto",
        folder: "videos",
      });
    } else {
      const videoStream = streamifier.createReadStream(videoFile.buffer);
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = dirname(__filename);

      await convertAVIToMP4(videoStream, fileType);
      videoCloud = await cloudinary.v2.uploader.upload(
        path.join(__dirname, "..", "Convertor", "new.mp4"),
        { resource_type: "auto", folder: "videos" }
      );
      fs.unlink(path.join(__dirname, "..", "Convertor", "new.mp4"), (err) => {
        if (err) throw err;
        console.log("Converted temporary file is deleted");
      });
    }

    const thumbnailUri = getDataUriParser(thumbnailImage);
    const thumbnailCloud = await cloudinary.v2.uploader.upload(
      thumbnailUri.content,
      { folder: "thumbnails" }
    );

    const video = new Video({
      title,
      description,
      videoURL: videoCloud.secure_url,
      thumbnailURL: thumbnailCloud.secure_url,
    });
    await video.save();
    res.status(201).json(video);
  } catch (error) {
    next(error);
  }
};

export const getAllVideos = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const page = parseInt(req.query.page) || 1;

    const videos = await Video.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    res.status(200).json(videos);
  } catch (error) {
    next(error);
  }
};

export const getVideo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video) throw new Error(`Video not found`);
    res.status(200).json(video);
  } catch (error) {
    next(error);
  }
};
