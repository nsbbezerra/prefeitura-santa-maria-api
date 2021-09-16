import fs from "fs";
import sharp from "sharp";

const compress = (file, size) => {
  const newPath = `${file.path.split(".")[0]}.webp`;
  const newFilename = `${file.filename.split(".")[0]}.webp`;
  return sharp(file.path)
    .resize(size)
    .toFormat("webp")
    .webp({ quality: 80 })
    .toBuffer()
    .then((data) => {
      fs.access(file.path, (err) => {
        if (!err) {
          fs.unlink(file.path, (err) => {
            if (err) console.log(err);
          });
        }
      });
      fs.writeFile(newPath, data, (err) => {
        if (err) {
          throw err;
        }
      });
      return newFilename;
    });
};

export { compress };
