const express = require("express");
const { default: ModelController } = require("../controllers/controller");
const router = express.Router();
const mcontroller = new ModelController();

router.post('/newModel', mcontroller.takeJson);

module.exports = router;
