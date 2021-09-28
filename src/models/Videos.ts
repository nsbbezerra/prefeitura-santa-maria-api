import { mongoose } from "../database/database";
const Schema = mongoose.Schema;
const model = mongoose.model;

interface IVideos extends mongoose.Document {
  video: string;
  created_at: Date;
}

const schema = new Schema<IVideos>({
  video: { type: String, required: true },
  created_at: { type: Date, required: false },
});

const videos = model<IVideos>("Videos", schema);

export { videos };
