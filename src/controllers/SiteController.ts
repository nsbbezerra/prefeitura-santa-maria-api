import { Request, Response, NextFunction } from "express";
import { informatives } from "../models/Informative";
import { publications } from "../models/Publications";
import { news } from "../models/News";
import { configs } from "../configs";
import { videos } from "../models/Videos";
import { banner } from "../models/Banners";

const IndexPage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const informative = await informatives
      .find()
      .sort({ created_at: -1 })
      .limit(10);
    const publication = await publications.find().sort({ date: -1 }).limit(6);
    const noticia = await news.find().sort({ date: -1 }).limit(4);
    const video = await videos.find().sort({ created_at: -1 }).limit(4);
    const banners = await banner.find().sort({ created_at: -1 });
    return res
      .status(200)
      .json({ informative, publication, noticia, video, banners });
  } catch (error) {
    next(error);
  }
};

const PublicationPage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { page } = req.params;
  const actPage = parseInt(page) - 1;
  try {
    const count = await publications.countDocuments();
    const publication = await publications
      .find()
      .sort({ date: -1 })
      .limit(configs.docs_per_page)
      .skip(configs.docs_per_page * parseInt(actPage.toString()));
    return res.status(200).json({ publication, count });
  } catch (error) {
    next(error);
  }
};

export { IndexPage, PublicationPage };
