import { schedules } from "../models/Schedule";
import { Request, Response, NextFunction } from "express";
import { mongoose } from "../database/database";

interface ISchedule extends mongoose.Document {
  month: string;
  year: number;
  date: Date;
  events: IEvents[];
  created_at: Date;
}

interface IEvents {
  schedule: string;
  description: string;
  created_at: Date;
}

interface CustomRequest<T> extends Request {
  body: T;
}

const CreateSchedule = async (
  req: CustomRequest<ISchedule>,
  res: Response,
  next: NextFunction
) => {
  const { month, year, date } = req.body;

  try {
    await schedules.create({ month, year, date });
    return res.status(201).json({ message: "Informação salva com sucesso" });
  } catch (error) {
    next(error);
  }
};

const CreateEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { schedule, description } = req.body;
  const { id } = req.params;

  try {
    const info = { schedule, description };
    await schedules.findOneAndUpdate({ _id: id }, { $push: { events: info } });
    return res.status(201).json({ message: "Informação salva com sucesso" });
  } catch (error) {
    next(error);
  }
};

const RemoveSchedule = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    await schedules.findOneAndDelete({ _id: id });

    return res.status(200).json({ message: "Informação excluída com sucesso" });
  } catch (error) {
    next(error);
  }
};

const ShowSchedule = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { month, year } = req.params;

  try {
    const schedule = await schedules
      .find({ month: month, year: parseInt(year) })
      .sort({ date: 1 });
    return res.status(200).json(schedule);
  } catch (error) {
    next(error);
  }
};

export { CreateEvents, CreateSchedule, RemoveSchedule, ShowSchedule };
