import * as mNM from "../middleware/middleModel";
const express = require("express");
const { default: ModelController } = require("../controllers/controller");
const router = express.Router();
const mcontroller = new ModelController();
//router.use(express.json());

router.post("/newModel", mNM.newModelValidation, async (req, res) => {
  res.sendStatus(201);
});

module.exports = router;
