import { Router } from "express";
import multer from "multer";
import { docs, img } from "./configs/multer";

import {
  Create as CreateBids,
  Delete as DeleteBids,
  ShowBids,
} from "./controllers/BidsController";
import {
  CreateDesk,
  ShowDesk,
  UpdateImage,
  UpdateInfo,
} from "./controllers/DeskController";
import {
  CreateInformatives,
  ShowInformatives,
  DeleteInformatives,
} from "./controllers/InformativeController";
import {
  CreatePublications,
  DeletePublications,
  ShowPublications,
} from "./controllers/PublicationsController";
import {
  CreateEvents,
  CreateSchedule,
  RemoveSchedule,
  ShowSchedule,
} from "./controllers/ScheduleController";
import {
  CreateSecretaries,
  UpdateImage as UpdateSecretaryImage,
  UpdateInfo as UpdateSecretaryInfo,
  DeleteSecretary,
  ShowSecretaries,
} from "./controllers/SecretariesController";

import {
  CreateGalery,
  CreateNews,
  FindNews,
  FindNewsById,
  UpdateNewsGalery,
  UpdateNewsImage,
  UpdateNewsInfo,
} from "./controllers/NewsController";
import { Test } from "./controllers/TestController";

import { IndexPage, PublicationPage } from "./controllers/SiteController";

const router = Router();

router.get("/test", Test);

/** NEWS - Notícias */
router.post("/news", multer(img).single("image"), CreateNews);
router.put("/newsGalery/:id", multer(img).array("galery", 12), CreateGalery);
router.get("/news", FindNews);
router.get("/newById/:id", FindNewsById);
router.put(
  "/updateNewsGalery/:id",
  multer(img).array("galery", 12),
  UpdateNewsGalery
);
router.put(
  "/updateNewsImage/:id",
  multer(img).single("image"),
  UpdateNewsImage
);
router.put("/news/:id", UpdateNewsInfo);

/** BIDS - Licitações e Editais */
router.post("/bids", multer(docs).array("pdf", 15), CreateBids);
router.delete("/bids/:id", DeleteBids);
router.get("/bids", ShowBids);

/** DESKS - Gabinetes */
router.post("/desk", multer(img).single("thumbnail"), CreateDesk);
router.get("/desk", ShowDesk);
router.put("/desk/:id", UpdateInfo);
router.put(
  "/changeImageDesk/:id",
  multer(img).single("thumbnail"),
  UpdateImage
);

/** INFORMATIVES - Imagens de Informativos */
router.post("/informatives", multer(img).single("image"), CreateInformatives);
router.get("/informatives", ShowInformatives);
router.delete("/informatives/:id", DeleteInformatives);

/** PUBLICATIONS - Publicações do diário oficial */
router.post("/publications", multer(docs).single("pdf"), CreatePublications);
router.get("/publications", ShowPublications);
router.delete("/publications/:id", DeletePublications);

/** SCHEDULLE - Agenda */
router.post("/schedule", CreateSchedule);
router.put("/schedule/:id", CreateEvents);
router.put("/scheduleDel/:id", RemoveSchedule);
router.get("/schedule/:month/:year", ShowSchedule);

/** SECRETARIES - Secretarias */
router.get("/secretaries", ShowSecretaries);
router.post("/secretaries", multer(img).single("thumbnail"), CreateSecretaries);
router.put(
  "/updateSecretaryImage/:id",
  multer(img).single("thumbnail"),
  UpdateSecretaryImage
);
router.put("/updateSecretaryInfo/:id", UpdateSecretaryInfo);
router.delete("/secretaries/:id", DeleteSecretary);

/** SITE CONTROLLER */
router.get("/indexSite", IndexPage);
router.get("/publicationPage/:page", PublicationPage);

export { router };
