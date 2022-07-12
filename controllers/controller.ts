import * as user from "../model/User";
import * as auth from "../middleware/middleAuth";
import * as model from "../model/Model";
import { Model } from "sequelize/types";
import { send } from "process";
import { checkObjective } from "../middleware/helpFunction/middleModFun";

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
      } else {
        console.log("modello con questo nome già esistente");
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
    delete modelnew["creation_date"];
    delete modelnew["options"];
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

    let modelJSON = JSON.parse(modelnewstring);
    return modelJSON;
  };

  public solveModel = async (req, res) => {
    try {
      let modelSolve: any = await model.checkExistingModel(
        req.body.name,
        req.body.version
      );
      let options = JSON.stringify(modelSolve.options);
      let filtrato = this.filtraJSON(modelSolve);
      let solveModel = glpk.solve(filtrato, options);
      res.status(200).json(solveModel);
    } catch (e) {
      console.log("non sono riuscito a risolvere");
      res.sendStatus(400);
    }
  };

  public creditCharge = async (req, res) => {
    if (req.user.budget > 0) {
      user.budgetUpdate(req.user.budget, req.user.emailuser);
      res.sendStatus(200);
    } else {
      res.sendStatus(400);
    }
  };

  public newReview = async (req, res) => {
    try {
      let modelCheck: any = await model.checkExistingModel(req.body.name);
      if (modelCheck) {
        let version = modelCheck.versione;
        let totalCost: number =
          (auth.costContraint(req.body) + auth.checkBinOrInt(req.body)) * 0.5;
        await model.insertReview(req.body, version + 1, totalCost);
        res.sendStatus(201);
      } else {
        res.sendStatus(404);
      }
    } catch (e) {
      res.sendStatus(404);
    }
  };

  public filterReviewByDate = async (req, res) => {
    try {
      let models: any = await model.filterByDate(req.body.name, req.body.date);
      let modelsF: any = models.map((item) => this.filtraJSON(item));
      res.status(200).json(modelsF);
    } catch (e) {
      res.sendStatus(404);
    }
  };


  /**
   * struttura json esempio: {"name": "namemodel", "number":3} number sarebbe il numero di variabili 
   * @param req 
   * @param res 
   */
  public filterByNumVars = async (req, res) => {
    try {
      let models: any = await model.getReviewOfModel(req.body.name);
      let modelsF: any = models
        .map((item) => this.filtraJSON(item))
        .filter((item) => item.objective.vars.length == req.body.number);
      console.log(models);
      console.log(modelsF);

      res.send(modelsF);
    } catch (e) {
      res.sendStatus(404);
    }
  };
}

export default ModelController;
