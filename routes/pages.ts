import * as mNM from "../middleware/middleModel";
import * as auth from "../middleware/middleAuth";
const express = require("express");
const { default: ModelController } = require("../controllers/controller");
const router = express.Router();
const mcontroller = new ModelController();
//router.use(express.json());

router.use(express.json());

router.use([auth.checkHeader, auth.checkToken, auth.verifyAndAuthenticate]);

router.post("/newModel", auth.checkUser, auth.checkIsUser, auth.checkCredito, mNM.newModelValidation, async (req, res) => {
  res.sendStatus(201);
});

module.exports = router;
