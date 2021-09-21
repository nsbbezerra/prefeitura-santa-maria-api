import express, { Request, Response, NextFunction } from "express";
import { router } from "./routes";
import { resolve } from "path";
import cors from "cors";

interface HTTPError extends Error {
  status?: number;
}

const app = express();

app.use(cors());
app.use(express.json());
app.use(router);
app.use((error: HTTPError, req: Request, res: Response, next: NextFunction) => {
  const errorMessage = error.message;
  return res.status(400).json({
    message: "Ocorreu um erro ao realizar a operação",
    errorMessage,
  });
});
app.use(
  "/img",
  express.static(resolve(__dirname, "..", "..", "uploads", "img"))
);
app.use(
  "/docs",
  express.static(resolve(__dirname, "..", "..", "uploads", "docs"))
);

export { app };
