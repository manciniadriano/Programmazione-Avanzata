import * as mNM from "../middleware/middleModel";
import * as auth from "../middleware/middleAuth";
import * as solve from "../middleware/middleSolve";
import * as admin from "../middleware/middleAdmin";
import ModelController from "../controllers/controllerModel";
import { ReviewController } from "../controllers/controllerReview";

const express = require("express");
const router = express.Router();

let cntrModel = new ModelController();
let cntrReview = new ReviewController();
router.use(express.json());

router.use((err, req, res, next) => {
  if (err instanceof SyntaxError && "body" in err) {
    res.sendStatus(400);
  }
  next();
});

router.use([auth.checkHeader, auth.checkToken, auth.verifyAndAuthenticate]);

router.post(
  "/newModel",
  auth.checkUser,
  auth.checkCredito,
  mNM.newModelValidation,
  async (req, res) => {
    cntrModel.insertNewModel(req, res);
  }
);

router.post(
  "/solveModel",
  auth.checkUser,
  solve.checkSolve,
  solve.checkCreditoSolve,
  async (req, res) => {
    cntrModel.solveModel(req, res);
  }
);

router.post(
  "/admin",
  admin.checkAdmin,
  admin.CheckReceiver,
  async (req, res) => {
    cntrModel.creditCharge(req, res);
  }
);

router.post(
  "/newReview",
  auth.checkUser,
  auth.checkCredito,
  mNM.newModelValidation,
  async (req, res) => {
    cntrReview.newReview(req, res);
  }
);

router.get("/filterReviews", auth.checkUser, async (req, res) => {
  cntrReview.filterReview(req, res);
});

router.get("/filterModels", auth.checkUser, async (req, res) => {
  cntrModel.filterPlus(req, res);
});

router.post("/deleteReview", auth.checkUser, async (req, res) => {
  cntrReview.deleteReview(req, res);
});

router.get("/getDeletedReview", auth.checkUser, async (req, res) => {
  cntrReview.getDeletedReview(req, res);
});

router.post("/restoreReview", auth.checkUser, async (req, res) => {
  cntrReview.restoreReview(req, res);
});

router.get("*", async (req, res) => {
  res.sendStatus(404);
});

router.post("*", async (req, res) => {
  res.sendStatus(404);
});

module.exports = router;
