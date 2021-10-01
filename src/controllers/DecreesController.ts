import { decrees } from "../models/Decrees";
import { Request, Response, NextFunction } from "express";
import fs from "fs";
import { resolve } from "path";
import { mongoose } from "../database/database";
import { configs } from "../configs/index";

interface IOrdinance extends mongoose.Document {
  title: string;
  description: string;
  file?: string;
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

const StoreDecrees = async (
  req: CustomRequest<IOrdinance>,
  res: Response,
  next: NextFunction
) => {
  const { title, description } = req.body;
  const { filename } = req.file;

  try {
    await decrees.create({
      title: title,
      description: description,
      file: filename,
    });
    return res.status(201).json({ message: "Informação inserida com sucesso" });
  } catch (error) {
    next(error);
  }
};

const RemoveDecrees = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const ordinance = await decrees.findOne({ _id: id });
    const path_to_file = resolve(
      __dirname,
      "..",
      "..",
      "..",
      "uploads",
      "docs",
      ordinance.file
    );
    RemoveFile(path_to_file);
    await decrees.findOneAndDelete({ _id: id });
    return res.status(200).json({ message: "Informação excluída com sucesso" });
  } catch (error) {
    next(error);
  }
};

const ShowDecrees = async (req: Request, res: Response, next: NextFunction) => {
  const { page } = req.params;
  const actPage = parseInt(page) - 1;

  try {
    const count = await decrees.countDocuments();
    const ordinance = await decrees
      .find()
      .sort({ created_at: -1 })
      .limit(configs.docs_per_page)
      .skip(configs.docs_per_page * actPage);
    return res.status(200).json({ count, ordinance });
  } catch (error) {
    next(error);
  }
};

export { StoreDecrees, RemoveDecrees, ShowDecrees };
