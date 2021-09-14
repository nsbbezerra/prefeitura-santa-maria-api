import { mongoose } from "../database/database";
const Schema = mongoose.Schema;
const model = mongoose.model;

interface INews {
  title: string;
  resume: string;
  author: string;
  date: Date;
  image: string;
  text: string;
  galery?: IImages[];
  created_at: Date;
}

interface IImages {
  image: string;
}

const schema = new Schema<INews>({
  title: { type: String, required: true },
  resume: { type: String, required: true },
  author: { type: String, required: true },
  date: { type: Date, required: true },
  image: { type: String, required: true },
  text: { type: String, required: true },
  galery: [{ image: { type: String } }],
  created_at: { type: Date, required: false },
});

schema.pre("save", function (next) {
  this.created_at = new Date();
  next();
});

const news = model("News", schema);

export { news };
