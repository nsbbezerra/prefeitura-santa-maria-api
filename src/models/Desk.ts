import { mongoose } from "../database/database";
const Schema = mongoose.Schema;
const model = mongoose.model;

interface IDesk {
  name: string;
  text: string;
  thumbnail: string;
  created_at: Date;
}

const schema = new Schema<IDesk>({
  name: { type: String, required: true },
  text: { type: String, required: true },
  thumbnail: { type: String, required: true },
  created_at: { type: Date, required: false },
});

schema.pre("save", function (next) {
  this.created_at = new Date();
  next();
});

const deks = model<IDesk>("Desk", schema);

export { deks };
