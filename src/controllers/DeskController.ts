import { deks } from "../models/Desk";
import fs from "fs";
import { resolve } from "path";
import { compress } from "../configs/sharp";
import { Request, Response, NextFunction } from "express";
import { mongoose } from "../database/database";
import { configs } from "../configs/index";

interface IDesk extends mongoose.Document {
  name: string;
  text: string;
  type: string;
  thumbnail: string;
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

const CreateDesk = async (
  req: CustomRequest<IDesk>,
  res: Response,
  next: NextFunction
) => {
  const { text, name, type } = req.body;

  try {
    if (req.file) {
      compress(req.file, 200).then((newPath) => {
        deks.create({ text, thumbnail: newPath, name, type });

        return res
          .status(200)
          .json({ message: "Informações inseridas com sucesso" });
      });
    } else {
      return res
        .status(400)
        .json({ message: "Não foi encontrada nenhuma imagem para salvar" });
    }
  } catch (error) {
    next(error);
  }
};

const ShowDesk = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const url = configs.default_url;
    const desk = await deks.find();
    return res.status(200).json({ url, desk });
  } catch (error) {
    next(error);
  }
};

const UpdateInfo = async (
  req: CustomRequest<IDesk>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { text, name, type } = req.body;

  try {
    const desk = await deks.findOneAndUpdate(
      { _id: id },
      { $set: { text, name, type } },
      { new: true }
    );

    return res
      .status(201)
      .json({ message: "Informações alteradas com sucesso", desk });
  } catch (error) {
    next(error);
  }
};

const UpdateImage = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    if (req.file) {
      const desk = await deks.findOne({ _id: id });
      const path_to_file = resolve(
        __dirname,
        "..",
        "..",
        "..",
        "uploads",
        "img",
        desk.thumbnail
      );
      RemoveFile(path_to_file);

      compress(req.file, 200).then((newPath) => {
        deks.findOneAndUpdate({ _id: id }, { $set: { thumbnail: newPath } });
        return res
          .status(200)
          .json({ message: "Informações alteradas com sucesso" });
      });
    } else {
      return res
        .status(400)
        .json({ message: "Não foi encontrada nenhuma imagem para salvar" });
    }
  } catch (error) {
    next(error);
  }
};

export { CreateDesk, ShowDesk, UpdateInfo, UpdateImage };
