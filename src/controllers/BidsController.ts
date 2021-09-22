import { bids } from "../models/Bids";
import { Request, Response, NextFunction } from "express";
import { mongoose } from "../database/database";
import fs from "fs";
import { resolve } from "path";
import { configs } from "../configs/index";

/** LICITAÇÕES E EDITAIS */
interface IBids extends mongoose.Document {
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

const Create = async (
  req: CustomRequest<IBids>,
  res: Response,
  next: NextFunction
) => {
  const files = req.files;
  const { title, date } = req.body;
  console.log(files);
  try {
    const bid = await bids.create({ title, date });

    const fileList = [];

    for (let index = 0; index < files.length; index++) {
      const name = files[index];
      let info = { file: name.filename };
      fileList.push(info);
    }

    await bids.findOneAndUpdate({ _id: bid._id }, { file: fileList });

    return res
      .status(201)
      .json({ message: "Informações inseridas com sucesso" });
  } catch (error) {
    next(error);
  }
};

const Delete = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const bid = await bids.findOne({ _id: id });
    const files = bid.file;
    await files.forEach((file) => {
      const path_to_file = resolve(
        __dirname,
        "..",
        "..",
        "..",
        "uploads",
        "docs",
        file.file
      );
      RemoveFile(path_to_file);
    });
    await bids.findOneAndDelete({ _id: id });
    return res.status(200).json({ message: "Informação removida com sucesso" });
  } catch (error) {
    next(error);
  }
};

const ShowBids = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const url = configs.default_docs_url;
    const bid = await bids.find().sort({ date: -1 });
    return res.status(200).json({ url, bid });
  } catch (error) {
    next(error);
  }
};

export { Create, Delete, ShowBids };
