import * as user from "../model/User";
import * as auth from "../middleware/middleAuth";
import * as model from "../model/Model";
import { Model } from "sequelize/types";

const GLPK = require("glpk.js");
const glpk = GLPK();

export class ModelController {
  public insertNewModel = async (req, res) => {
    try {
      let totalCost: number =
        auth.costContraint(req.body) + auth.checkBinOrInt(req.body);
      var flag = await model.insertModel(req.body, totalCost);
      if (flag) {
        let oldBudget: any = await user.getBudget(req.user.email);
        let newBudget = oldBudget.budget - totalCost;
        await user.budgetUpdate(newBudget, req.user.email);
        res.sendStatus(201);
      }
      else {
        console.log('modello con questo nome già esistente');
        res.sendStatus(400);
      }
    } catch {
      console.log("errore");
      res.sendStatus(400);
    }
  };

  public filtraJSON = (json: any) => {

    let stringModel: string = JSON.stringify(json);
    let modelnew = JSON.parse(stringModel);

    delete modelnew["id"];
    delete modelnew["cost"];
    delete modelnew["versione"];
    modelnew.name = modelnew.namemodel;
    delete modelnew.namemodel;
    modelnew.subjectTo = modelnew.subjectto;
    delete modelnew.subjectto;
    Object.keys(modelnew).forEach((key) => {
      if (modelnew[key] === null) {
        delete modelnew[key];
      }
    });
    let modelnewstring: string = JSON.stringify(modelnew);

    let modelJSON = JSON.parse(modelnewstring)
    return modelJSON;
  }

  public solveModel = async (req, res) => {
    try {

      let modelSolve: any = await model.checkExistingModel(
        req.body.name,
        req.body.version
      );
      let solveModel = glpk.solve(this.filtraJSON(modelSolve), modelSolve.options);
      res.status(200).send(JSON.stringify(solveModel));
    }
    catch (e) {
      console.log('non sono riuscito a risolvere');
      res.sendStatus(400);
    }
  };

  public creditCharge = async (req, res) => {
    if (req.user.budget > 0) {
      user.budgetUpdate(req.user.budget, req.user.emailuser);
      res.sendStatus(200);
    }
    else {
      res.sendStatus(400);
    }

  };
}
export default ModelController;