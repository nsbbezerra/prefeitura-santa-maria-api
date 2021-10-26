import { banner } from "../models/Banners";
import { Request, Response, NextFunction } from "express";
import fs from "fs";
import { resolve } from "path";
import { mongoose } from "../database/database";
import { compress } from "../configs/sharp";

interface IBanner extends mongoose.Document {
  banner: string;
  url: string;
  created_at: Date;
}

interface CustomRequest<T> extends Request {
  body: T;
}

async function RemoveFile(url: string) {
  fs.unlink(url, (err) => {
    if (err) console.log(err);
    else {
      console.log();
    }
  });
}

const StoreBanner = async (
  req: CustomRequest<IBanner>,
  res: Response,
  next: NextFunction
) => {
  const { url } = req.body;
  try {
    if (req.file) {
      compress(req.file, 1200).then((newPath) => {
        banner.create({ banner: newPath, url: url });
      });

      return res.status(201).json({ message: "Banner salvo com sucesso" });
    } else {
      return res
        .status(400)
        .json({ message: "Nenhuma imagem encontrada para salvar" });
    }
  } catch (error) {
    next(error);
  }
};

const FindBanner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const banners = await banner.find();
    return res.status(200).json(banners);
  } catch (error) {
    next(error);
  }
};

const RemoveBanner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const findBanner = await banner.findOne({ _id: id });

    const path_to_file = resolve(
      __dirname,
      "..",
      "..",
      "..",
      "uploads",
      "img",
      findBanner.banner
    );

    RemoveFile(path_to_file);

    await banner.findOneAndRemove({ _id: id });

    return res.status(200).json({ message: "Banner removido com sucesso" });
  } catch (error) {
    next(error);
  }
};

export { StoreBanner, FindBanner, RemoveBanner };
