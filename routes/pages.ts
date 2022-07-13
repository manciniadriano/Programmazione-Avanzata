import * as mNM from "../middleware/middleModel";
import * as auth from "../middleware/middleAuth";
import * as solve from "../middleware/middleSolve";
import * as admin from "../middleware/middleAdmin";
import ModelController from "../controllers/controller";

const express = require("express");
const router = express.Router();

let controller = new ModelController();
router.use(express.json());

router.use((err, req, res, next) => {
  if (err instanceof SyntaxError && "body" in err) {
    res.sendStatus(400);
  }
  next();
});

router.use([auth.checkHeader, auth.checkToken, auth.verifyAndAuthenticate]);

router.get("*", async (req, res) => {
  res.sendStatus(404);
});

router.post("*", async (req, res) => {
  res.sendStatus(404);
});

router.post(
  "/newModel",
  auth.checkUser,
  auth.checkCredito,
  mNM.newModelValidation,
  async (req, res) => {
    controller.insertNewModel(req, res);
  }
);

router.post(
  "/solveModel",
  auth.checkUser,
  solve.checkSolve,
  solve.checkCreditoSolve,
  async (req, res) => {
    controller.solveModel(req, res);
  }
);

router.post(
  "/admin",
  auth.checkAdmin,
  admin.CheckReceiver,
  async (req, res) => {
    controller.creditCharge(req, res);
  }
);

router.post(
  "/newReview",
  auth.checkUser,
  auth.checkCredito,
  mNM.newModelValidation,
  async (req, res) => {
    controller.newReview(req, res);
  }
);

router.get("/filterReviewDate", auth.checkUser, async (req, res) => {
  controller.filterReviewByDate(req, res);
});

router.get("/filterNumVars", auth.checkUser, async (req, res) => {
  controller.filterByNumVars(req, res);
});

router.get("/filterModels", auth.checkUser, async (req, res) => {
  controller.filterPlus(req, res);
});

router.post("/deleteReview", auth.checkUser, async (req, res) => {
  controller.deleteReview(req, res);
});

router.get("/getDeletedReview", auth.checkUser, async (req, res) => {
  controller.getDeletedReview(req, res);
});

router.post("/restoreReview", auth.checkUser, async (req, res) => {
  controller.restoreReview(req, res);
});

module.exports = router;
