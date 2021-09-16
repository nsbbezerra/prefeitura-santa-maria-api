import * as multer from "multer";
import { resolve } from "path";
import { randomBytes } from "crypto";

const img = {
  storage: multer.diskStorage({
    destination: resolve(__dirname, "..", "..", "..", "uploads", "img"),
    filename: (req, file, cb) => {
      const ext = file.originalname.split(".")[1];
      const name = randomBytes(64).toString("hex");
      cb(null, `${name}.${ext}`);
    },
  }),
};

const docs = {
  storage: multer.diskStorage({
    destination: resolve(__dirname, "..", "..", "..", "uploads", "docs"),
    filename: (req, file, cb) => {
      const ext = file.originalname.split(".")[1];
      const name = randomBytes(64).toString("hex");
      cb(null, `${name}.${ext}`);
    },
  }),
};

export { img, docs };
