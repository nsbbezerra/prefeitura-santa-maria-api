import { mongoose } from "../database/database";
const Schema = mongoose.Schema;
const model = mongoose.model;

interface INews {
  title: string;
  resume?: string;
  author?: string;
  date: Date;
  image: string;
  imageCopy?: string;
  text: string;
  galery?: IImages[];
  month: string;
  year: number;
  created_at: Date;
  tag?: string;
}

interface IImages {
  image: string;
}

const schema = new Schema<INews>({
  title: { type: String, required: true },
  resume: { type: String, required: false },
  author: { type: String, required: false },
  date: { type: Date, required: true },
  image: { type: String, required: true },
  imageCopy: { type: String, required: false },
  text: { type: String, required: true },
  month: { type: String, required: true },
  year: { type: Number, required: true },
  galery: [{ image: { type: String } }],
  created_at: { type: Date, required: false },
  tag: { type: String, required: false },
});

schema.pre("save", function (next) {
  this.created_at = new Date();
  next();
});

const news = model<INews>("News", schema);

export { news };
