import { deks } from "../models/Desk";
import fs from "fs";
import path from "path";
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

export { CreateDesk, ShowDesk };
