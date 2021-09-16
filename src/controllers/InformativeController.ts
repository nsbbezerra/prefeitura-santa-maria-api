import { informatives } from "../models/Informative";
import { resolve } from "path";
import fs from "fs";
import { configs } from "../configs/index";
import { Request, Response, NextFunction } from "express";
import { compress } from "../configs/sharp";
import { mongoose } from "../database/database";

interface IInformative extends mongoose.Document {
  image: string;
  created_at: Date;
}

interface CustomResponse<T> extends Request {
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

const CreateInformatives = async (
  req: CustomResponse<IInformative>,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.file) {
      compress(req.file, 100).then((newPath) => {
        informatives.create({ image: newPath });

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

const ShowInformatives = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const informative = await informatives.find().sort({ created_at: -1 });
    const url = configs.default_url;
    return res.status(200).json({ url, informative });
  } catch (error) {
    next(error);
  }
};

const DeleteInformatives = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const infor = await informatives.findOne({ _id: id });
    const path_to_file = resolve(
      __dirname,
      "..",
      "..",
      "..",
      "uploads",
      "img",
      infor.image
    );
    RemoveFile(path_to_file);

    await informatives.findOneAndDelete({ _id: id });

    return res.status(200).json({ message: "Informação excluída com sucesso" });
  } catch (error) {
    next(error);
  }
};

export { CreateInformatives, ShowInformatives, DeleteInformatives };
