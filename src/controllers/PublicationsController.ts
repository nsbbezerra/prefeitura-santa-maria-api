import { publications } from "../models/Publications";
import fs from "fs";
import { resolve } from "path";
import { Request, Response, NextFunction } from "express";
import { mongoose } from "../database/database";
import { configs } from "../configs";

interface IPublications extends mongoose.Document {
  title: string;
  date: Date;
  file: string;
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

const CreatePublications = async (
  req: CustomRequest<IPublications>,
  res: Response,
  next: NextFunction
) => {
  const { title, date } = req.body;
  const { filename } = req.file;

  try {
    await publications.create({ title, date, file: filename });
    return res.status(201).json({ message: "Informação salva com sucesso" });
  } catch (error) {
    next(error);
  }
};

const DeletePublications = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const publi = await publications.findOne({ _id: id });
    const path_to_file = resolve(
      __dirname,
      "..",
      "..",
      "..",
      "uploads",
      "docs",
      publi.file
    );
    RemoveFile(path_to_file);
    await publications.findOneAndDelete({ _id: id });

    return res.status(200).json({ message: "Informação excluída com sucesso" });
  } catch (error) {
    next(error);
  }
};

const ShowPublications = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const publication = await publications.find().sort({ date: -1 });
    const url = configs.default_url;
    return res.status(200).json({ publication, url });
  } catch (error) {
    next(error);
  }
};

export { CreatePublications, DeletePublications, ShowPublications };
