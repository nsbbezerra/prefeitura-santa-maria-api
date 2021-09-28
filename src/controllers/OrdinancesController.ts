import { ordinances } from "../models/Ordinances";
import { Request, Response, NextFunction } from "express";
import fs from "fs";
import { resolve } from "path";
import { mongoose } from "../database/database";
import { configs } from "../configs/index";

interface IOrdinance extends mongoose.Document {
  title: string;
  description: string;
  secretary_id: mongoose.Schema.Types.ObjectId;
  file?: string;
  created_at: Date;
}

interface IPage {
  page: string;
  title: string;
  description: string;
  secretary_id: mongoose.Schema.Types.ObjectId;
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

const StoreOrinance = async (
  req: CustomRequest<IOrdinance>,
  res: Response,
  next: NextFunction
) => {
  const { title, description, secretary_id } = req.body;
  const { filename } = req.file;

  try {
    await ordinances.create({
      title: title,
      description: description,
      file: filename,
      secretary_id: secretary_id,
    });
    return res.status(201).json({ message: "Informação inserida com sucesso" });
  } catch (error) {
    next(error);
  }
};

const RemoveOrdinance = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const ordinance = await ordinances.findOne({ _id: id });
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
    await ordinances.findOneAndDelete({ _id: id });
    return res.status(200).json({ message: "Informação excluída com sucesso" });
  } catch (error) {
    next(error);
  }
};

const ShowOrdinance = async (
  req: Request<IPage>,
  res: Response,
  next: NextFunction
) => {
  const { secretary_id, page } = req.params;
  const actPage = parseInt(page) - 1;

  try {
    const count = await ordinances.countDocuments({ secretary_id });
    const ordinance = await ordinances
      .find({ secretary_id })
      .sort({ created_at: -1 })
      .limit(configs.docs_per_page)
      .skip(configs.docs_per_page * actPage);
    return res.status(200).json({ count, ordinance });
  } catch (error) {
    next(error);
  }
};

export { StoreOrinance, RemoveOrdinance, ShowOrdinance };
