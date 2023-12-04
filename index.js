import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cloudinary from "cloudinary";
import videoRouter from "./routes/video.route.js";
import cors from "cors";
import dbConnection from "./db/dbConfig.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/video", videoRouter);
dbConnection();

cloudinary.v2.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
  secure: process.env.secure,
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    status: err.status || 500,
    message: err.message || "Internal Server error",
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
