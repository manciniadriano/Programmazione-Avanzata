import * as mNM from "../middleware/middleModel";
import * as auth from "../middleware/middleAuth";
import * as solve from "../middleware/middleSolve";
import ModelController from "../controllers/controller";

const express = require("express");
const router = express.Router();
//router.use(express.json());

let controller = new ModelController()
router.use(express.json());

router.use([auth.checkHeader, auth.checkToken, auth.verifyAndAuthenticate]);

router.post("/newModel", auth.checkIsUser, auth.checkCredito, mNM.newModelValidation, async (req, res) => {
  controller.insertNewModel(req, res);
});

router.post("/solveModel", solve.checkSolve, solve.checkCreditoSolve, async (req, res) => {
  controller.solveModel(req, res)
});

module.exports = router;
