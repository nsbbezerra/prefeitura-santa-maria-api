import { mongoose } from "../database/database";
const Schema = mongoose.Schema;
const model = mongoose.model;

interface IOrdinance extends mongoose.Document {
  title: string;
  description: string;
  secretary_id: mongoose.Schema.Types.ObjectId;
  file?: string;
  created_at: Date;
}

const schema = new Schema<IOrdinance>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  secretary_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Secretaries",
    required: true,
  },
  file: { type: String },
  created_at: { type: Date, required: false },
});

schema.pre("save", function (next) {
  this.created_at = new Date();
  next();
});

const ordinances = model<IOrdinance>("Ordinances", schema);

export { ordinances };
