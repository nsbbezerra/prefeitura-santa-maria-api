import { mongoose } from "../database/database";
const Schema = mongoose.Schema;
const model = mongoose.model;

interface IInformative {
  image: string;
  created_at: Date;
}

const schema = new Schema<IInformative>({
  image: { type: String, required: true },
  created_at: { type: Date, required: false },
});

schema.pre("save", function (next) {
  this.created_at = new Date();
  next();
});

const informatives = model("Informatives", schema);

export { informatives };
