import { mongoose } from "../database/database";
const Schema = mongoose.Schema;
const model = mongoose.model;

interface ISecretary {
  name: string;
  address: string;
  phone: string;
  email: string;
  schedule: string;
  thumbnail: string;
  created_at: Date;
}

const schema = new Schema<ISecretary>({
  name: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  schedule: { type: String, required: true },
  thumbnail: { type: String, required: true },
  created_at: { type: Date, required: false },
});

schema.pre("save", function (next) {
  this.created_at = new Date();
  next();
});

const secretaries = model("Secretaries", schema);

export { secretaries };
