import { secretaries } from "../models/Secretaries";
import { Request, Response, NextFunction } from "express";
import { compress } from "../configs/sharp";
import { resolve } from "path";
import fs from "fs";
import { mongoose } from "../database/database";

interface ISecretary extends mongoose.Document {
  title: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  schedule: string;
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
      console.log("Removed");
    }
  });
}

const CreateSecretaries = async (
  req: CustomRequest<ISecretary>,
  res: Response,
  next: NextFunction
) => {
  const { title, name, address, phone, email, schedule } = req.body;
  console.log(req.file);
  try {
    if (req.file) {
      compress(req.file, 300).then((newPath) => {
        secretaries.create({
          title,
          name,
          address,
          phone,
          email,
          schedule,
          thumbnail: newPath,
        });

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

const UpdateInfo = async (
  req: CustomRequest<ISecretary>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { title, name, address, phone, email, schedule } = req.body;

  try {
    await secretaries.findOneAndUpdate(
      { _id: id },
      { $set: { title, name, address, phone, email, schedule } }
    );
    return res.status(201).json({ message: "Informação alterada com sucesso" });
  } catch (error) {
    next(error);
  }
};

const UpdateImage = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    if (req.file) {
      const secretary = await secretaries.findOne({ _id: id });
      const path_to_file = resolve(
        __dirname,
        "..",
        "..",
        "..",
        "uploads",
        "img",
        secretary.thumbnail
      );
      RemoveFile(path_to_file);

      async function saveImage(pathImage) {
        await secretaries.findOneAndUpdate(
          { _id: id },
          { $set: { thumbnail: pathImage } }
        );
      }

      compress(req.file, 300).then((newPath) => {
        saveImage(newPath);

        return res
          .status(200)
          .json({ message: "Informação alterada com sucesso" });
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

const DeleteSecretary = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const secretary = await secretaries.findOne({ _id: id });
    const path_to_file = resolve(
      __dirname,
      "..",
      "..",
      "..",
      "uploads",
      "img",
      secretary.thumbnail
    );
    RemoveFile(path_to_file);
    await secretaries.findOneAndDelete({ _id: id });
    return res.status(200).json({ message: "Informação excluída com sucesso" });
  } catch (error) {
    next(error);
  }
};

const ShowSecretaries = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const secretary = await secretaries.find().sort({ name: 1 });
    return res.status(200).json(secretary);
  } catch (error) {
    next(error);
  }
};

export {
  CreateSecretaries,
  UpdateImage,
  UpdateInfo,
  DeleteSecretary,
  ShowSecretaries,
};
