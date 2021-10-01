import { mongoose } from "../database/database";
const Schema = mongoose.Schema;
const model = mongoose.model;

interface IDecrees extends mongoose.Document {
  title: string;
  description: string;
  file?: string;
  created_at: Date;
}

const schema = new Schema<IDecrees>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  file: { type: String },
  created_at: { type: Date, required: false },
});

schema.pre("save", function (next) {
  this.created_at = new Date();
  next();
});

const decrees = model<IDecrees>("Decrees", schema);

export { decrees };
