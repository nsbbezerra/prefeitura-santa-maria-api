import { mongoose } from "../database/database";
const Schema = mongoose.Schema;
const model = mongoose.model;

/** LICITAÇÕES E EDITAIS */

interface IBids {
  title: string;
  date: Date;
  file?: IFile[];
  created_at: Date;
}

interface IFile {
  file: string;
}

const schema = new Schema<IBids>({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  file: [{ file: { type: String } }],
  created_at: { type: Date, required: false },
});

schema.pre("save", function (next) {
  this.created_at = new Date();
  next();
});

const bids = model<IBids>("Bids", schema);

export { bids };
