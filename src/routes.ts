import { Router } from "express";
import multer from "multer";
import { docs, img } from "./configs/multer";

import {
  Create as CreateBids,
  Delete as DeleteBids,
  ShowBids,
} from "./controllers/BidsController";
import { CreateDesk, ShowDesk } from "./controllers/DeskController";

const router = Router();

/** BIDS - Licitações e Editais */
router.post("/bids", multer(docs).array("pdf", 15), CreateBids);
router.delete("/bids/:id", DeleteBids);
router.get("/bids", ShowBids);

/** DESKS - Gabinetes */
router.post("/desk", multer(img).single("thumbnail"), CreateDesk);
router.get("/desk", ShowDesk);

export { router };
