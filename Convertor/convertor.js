import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

export function convertAVIToMP4(aviBuffer, fileType) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  ffmpeg.setFfmpegPath(ffmpegStatic);
  return new Promise((resolve, reject) => {
    const inputStream = new ffmpeg();
    inputStream
      .input(aviBuffer)
      .toFormat("mp4")
      .videoCodec("libx264")
      .audioCodec("aac")
      .videoBitrate(1100)
      .audioBitrate(128)
      .on("end", () => {
        console.log("Conversion finished");
        resolve(inputStream._currentOutput);
      })
      .on("error", (err) => {
        console.error(`Error converting ${fileType} to MP4:`, err);
        reject(err);
      })
      .save(path.join(__dirname, "new.mp4"));
  });
}
