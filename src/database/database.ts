import mongoose from "mongoose";

const connection = "mongodb://localhost:27017/prefeitura";

mongoose.connect(connection);
mongoose.Promise = global.Promise;

export { mongoose };
