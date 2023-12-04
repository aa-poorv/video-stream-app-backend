import DataUriParser from "datauri/parser.js";
import path from "path";

const getDataUriParser = (file) => {
  const parser = new DataUriParser();
  let extname = path.extname(file.originalname).toString().toLowerCase();

  if (extname === ".mpg") extname = ".mpeg";
  return parser.format(extname, file.buffer);
};

export default getDataUriParser;
