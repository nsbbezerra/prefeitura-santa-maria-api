import { mongoose } from "../database/database";
const Schema = mongoose.Schema;
const model = mongoose.model;

interface IBanner {
  banner: string;
  url: string;
  created_at: Date;
}

const schema = new Schema<IBanner>({
  banner: { type: String, required: true },
  url: { type: String, required: false },
  created_at: { type: Date, required: false },
});

schema.pre("save", function (next) {
  this.created_at = new Date();
  next();
});

const banner = model<IBanner>("Banners", schema);

export { banner };
