import { news } from "../models/News";
import { Request, Response, NextFunction } from "express";
import fs from "fs";
import { resolve } from "path";
import { mongoose } from "../database/database";
import { configs } from "../configs";

interface INews extends mongoose.Document {
  title: string;
  resume: string;
  author: string;
  date: Date;
  image: string;
  text: string;
  galery?: IImages[];
  month: string;
  year: number;
  created_at: Date;
  tag: string;
  imageCopy: string;
}

interface IImages {
  image: string;
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

const CreateNews = async (
  req: CustomRequest<INews>,
  res: Response,
  next: NextFunction
) => {
  const { title, resume, author, date, imageCopy, text, month, year, tag } =
    req.body;
  const { filename } = req.file;
  try {
    const noticia = await news.create({
      title,
      resume,
      author,
      date,
      imageCopy,
      text,
      month,
      year,
      tag,
      image: filename,
    });
    const id = noticia._id;
    return res
      .status(201)
      .json({ message: "Informação inserida com sucesso", id });
  } catch (error) {
    next(error);
  }
};

const CreateGalery = async (
  req: CustomRequest<INews>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const images = req.files;
    let imagesList = [];
    for (let index = 0; index < images.length; index++) {
      const name = images[index];
      const info = { image: name.filename };
      imagesList.push(info);
    }
    await news.findOneAndUpdate({ _id: id }, { $set: { galery: imagesList } });

    return res
      .status(201)
      .json({ message: "Informações inseridas com sucesso" });
  } catch (error) {
    next(error);
  }
};

const UpdateNewsInfo = async (
  req: CustomRequest<INews>,
  res: Response,
  next: NextFunction
) => {
  const { title, resume, author, date, imageCopy, text, month, year, tag } =
    req.body;
  const { id } = req.params;
  try {
    await news.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          title,
          resume,
          author,
          date,
          imageCopy,
          text,
          month,
          year,
          tag,
        },
      }
    );
    return res
      .status(201)
      .json({ message: "Informações alteradas com sucesso" });
  } catch (error) {
    next(error);
  }
};

const UpdateNewsImage = async (
  req: CustomRequest<INews>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { imageCopy } = req.body;
  const { filename } = req.file;
  try {
    const noticia = await news.findOne({ _id: id });
    const path_to_file = resolve(
      __dirname,
      "..",
      "..",
      "..",
      "uploads",
      "img",
      noticia.image
    );
    RemoveFile(path_to_file);

    const nova_noticia = await news.findOneAndUpdate(
      { _id: id },
      { $set: { image: filename, imageCopy: imageCopy } },
      { new: true }
    );
    const imagem = nova_noticia.image;

    return res
      .status(201)
      .json({ message: "Informação alterada com sucesso", imagem });
  } catch (error) {
    next(error);
  }
};

const UpdateNewsGalery = async (
  req: CustomRequest<INews>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const noticia = await news.findOne({ _id: id });
    const galery = noticia.galery;

    galery.forEach((element) => {
      const path_to_file = resolve(
        __dirname,
        "..",
        "..",
        "..",
        "uploads",
        "img",
        element.image
      );
      RemoveFile(path_to_file);
    });

    const images = req.files;
    let imageList = [];

    for (let index = 0; index < images.length; index++) {
      const name = images[index];
      const info = { image: name.filename };
      imageList.push(info);
    }

    await news.findOneAndUpdate({ _id: id }, { $set: { galery: imageList } });

    return res
      .status(201)
      .json({ message: "Informações alteradas com sucesso" });
  } catch (error) {
    next(error);
  }
};

const FindNewsById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const noticia = await news.findOne({ _id: id });
    const others = await news
      .find({ _id: { $ne: id } })
      .sort({ date: -1 })
      .limit(4);

    return res.status(200).json({ noticia, others });
  } catch (error) {
    next(error);
  }
};

const FindNews = async (req: Request, res: Response, next: NextFunction) => {
  const { page } = req.params;
  const actPage = parseInt(page) - 1;

  try {
    const count = await news.countDocuments();
    const noticias = await news
      .find()
      .sort({ date: -1 })
      .limit(configs.docs_per_page)
      .skip(configs.docs_per_page * actPage);
    return res.status(200).json({ noticias, count });
  } catch (error) {
    next(error);
  }
};

const ShowNews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const noticias = await news.find().sort({ date: -1 });
    return res.status(200).json(noticias);
  } catch (error) {
    next(error);
  }
};

export {
  CreateGalery,
  CreateNews,
  UpdateNewsGalery,
  UpdateNewsImage,
  UpdateNewsInfo,
  FindNews,
  FindNewsById,
  ShowNews,
};
