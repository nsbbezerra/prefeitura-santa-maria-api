import { videos } from "../models/Videos";
import { Request, Response, NextFunction } from "express";
import { mongoose } from "../database/database";
import { configs } from "../configs/index";

interface IVideos extends mongoose.Document {
  video: string;
  created_at: Date;
}

interface CustomRequest<T> extends Request {
  body: T;
}

const StoreVideos = async (
  req: CustomRequest<IVideos>,
  res: Response,
  next: NextFunction
) => {
  const { video } = req.body;

  try {
    await videos.create({ video });
    return res.status(201).json({ message: "Informação inserida com sucesso" });
  } catch (error) {
    next(error);
  }
};

const RemoveVideo = async (
  req: CustomRequest<IVideos>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    await videos.findOneAndDelete({ _id: id });
    return res.status(200).json({ message: "Informação excluída com sucesso" });
  } catch (error) {
    next(error);
  }
};

const ShowVideos = async (req: Request, res: Response, next: NextFunction) => {
  const { page } = req.params;
  const actPage = parseInt(page) - 1;

  try {
    const count = await videos.countDocuments();
    const video = await videos
      .find()
      .sort({ created_at: -1 })
      .limit(configs.docs_per_page)
      .skip(configs.docs_per_page * actPage);
    return res.status(200).json({ count, video });
  } catch (error) {
    next(error);
  }
};

export { StoreVideos, RemoveVideo, ShowVideos };
