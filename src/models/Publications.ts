import { mongoose } from "../database/database";
const Schema = mongoose.Schema;
const model = mongoose.model;

interface IPublications {
  title: string;
  date: Date;
  file: string;
  created_at: Date;
}

const schema = new Schema<IPublications>({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  file: { type: String, required: true },
  created_at: { type: Date, required: false },
});

schema.pre("save", function (next) {
  this.created_at = new Date();
  next();
});

const publications = model("Publications", schema);

export { publications };
