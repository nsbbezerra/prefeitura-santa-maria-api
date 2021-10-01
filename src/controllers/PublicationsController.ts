import { publications } from "../models/Publications";
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

const CreatePublications = async (
  req: CustomRequest<IPublications>,
  res: Response,
  next: NextFunction
) => {
  const { title, date, file } = req.body;

  try {
    await publications.create({ title, date, file: file });
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
    const url = configs.default_docs_url;
    return res.status(200).json({ publication, url });
  } catch (error) {
    next(error);
  }
};

export { CreatePublications, DeletePublications, ShowPublications };
