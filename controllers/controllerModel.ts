import * as user from "../model/User";
import * as auth from "../middleware/middleAuth";
import * as model from "../model/Model";

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
    delete modelnew["version"];
    delete modelnew["creation_date"];
    delete modelnew["options"];
    delete modelnew["valid"];

    let s = JSON.stringify(modelnew);
    var t = s.replace(/"namemodel"/g, '"name"');
    var z = t.replace(/"subjectto"/g, '"subjectTo"');

    let modelFiltered = JSON.parse(z);
    Object.keys(modelFiltered).forEach((key) => {
      if (modelFiltered[key] === null) {
        delete modelFiltered[key];
      }
    });

    return modelFiltered;
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

  public filterPlus = async (req, res) => {
    try {
      let models: any = await model.getModels();
      let modelsF: any = models
        .map((item) => this.filtraJSON(item))
        .filter((item) => {
          if (req.body.numvars) {
            return item.objective.vars.length === req.body.numvars;
          } else return true;
        })
        .filter((item) => {
          if (req.body.numsub) {
            return item.subjectTo.length === req.body.numsub;
          } else return true;
        })
        .filter((item) => {
          let numGen: number = 0;
          let numBin: number = 0;
          if (item.generals) {
            numGen = item.generals.length;
          }
          if (item.binaries) {
            numBin = item.binaries.length;
          }
          let notContinuous = numGen + numBin;
          let totalVars = item.objective.vars.length;
          if (req.body.countinous == 1) {
            if (totalVars - notContinuous > 0) {
              return true;
            } else {
              return false;
            }
          } else {
            if (totalVars - notContinuous > 0) {
              return false;
            } else {
              return true;
            }
          } 
        })
        .filter((item) => {
          if (req.body.generals === 1) {
            if (!(item.generals === undefined)) {
              return true;
            } else return false;
          } else {
            return item.generals === undefined;
          }
        })
        .filter((item) => {
          if (req.body.binaries === 1) {
            if (!(item.binaries === undefined)) {
              return true;
            } else return false;
          } else {
            return item.binaries === undefined;
          }
        });
      res.send(modelsF);
    } catch (e) {
      res.sendStatus(400);
    }
  };
}

export default ModelController;
