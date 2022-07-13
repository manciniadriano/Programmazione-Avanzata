import * as mNM from "../middleware/middleModel";
import * as auth from "../middleware/middleAuth";
import * as solve from "../middleware/middleSolve";
import * as admin from "../middleware/middleAdmin";
import ModelController from "../controllers/controller";

const express = require("express");
const router = express.Router();
//router.use(express.json());

let controller = new ModelController()
router.use(express.json());

router.use((err, req, res, next) => {
  if (err instanceof SyntaxError && 'body' in err) {
      res.sendStatus(400);
  }
  next();
});

router.use([auth.checkHeader, auth.checkToken, auth.verifyAndAuthenticate]);

router.post("/newModel", auth.checkUser, auth.checkIsUser, auth.checkCredito, mNM.newModelValidation, async (req, res) => {
  controller.insertNewModel(req, res);
});

router.post("/solveModel", solve.checkSolve, solve.checkCreditoSolve, async (req, res) => {
  controller.solveModel(req, res)
});

router.post("/admin", auth.checkUser, auth.checkIsAdmin, admin.CheckReceiver, async (req, res) => {
  controller.creditCharge(req,res)
});

router.post("/newReview", auth.checkUser, auth.checkIsUser, auth.checkCredito, mNM.newModelValidation, async (req, res) => {
  controller.newReview(req, res);
})

router.get("/filterReviewDate", auth.checkUser, auth.checkIsUser, async (req, res) => {
  controller.filterReviewByDate(req, res);
})

router.get("/filterNumVars", auth.checkUser, auth.checkIsUser, async (req, res) => {
  controller.filterByNumVars(req,res);
})

router.get("/filterModels", auth.checkUser, auth.checkIsUser, async (req, res) => {
  controller.filterPlus(req,res);
})

router.post("/deleteReview", auth.checkUser, auth.checkIsUser, async (req, res) => {
  controller.deleteReview(req,res);
})

router.get("/", auth.checkUser, auth.checkIsUser, async (req, res) => {
  controller.filterReviewByDate(req, res);
})

module.exports = router;
