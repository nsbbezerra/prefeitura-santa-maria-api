import { mongoose } from "../database/database";
const Schema = mongoose.Schema;
const model = mongoose.model;

interface ISchedule {
  month: string;
  year: number;
  date: Date;
  events?: IEvents[];
  created_at: Date;
}

interface IEvents {
  schedule: string;
  description: string;
  created_at: Date;
}

const schema = new Schema<ISchedule>({
  month: { type: String, required: true },
  year: { type: Number, required: true },
  date: { type: Date, required: true },
  events: [
    {
      schedule: { type: String },
      description: { type: String },
    },
  ],
  created_at: { type: Date, required: false },
});

schema.pre("save", function (next) {
  this.created_at = new Date();
  next();
});

const schedules = model<ISchedule>("Schedules", schema);

export { schedules };
