import * as user from "../model/User";
import * as auth from "../middleware/middleAuth";
import * as model from "../model/Model";
import { Model } from "sequelize/types";

const GLPK = require("glpk.js");
const glpk = GLPK();

const options = {
  msglev: glpk.GLP_MSG_ALL,
  presol: true,
  cb: {
    call: (progress) => console.log(progress),
    each: 1,
  },
};

export class ModelController {
  public insertNewModel = async (req, res) => {
    try {
      console.log("reqbody: " + req.body);
      let totalCost: number =
        auth.costContraint(req.body) + auth.checkBinOrInt(req.body);
      await model.insertModel(req.body, totalCost);
      let oldBudget: any = await user.getBudget(req.user.email);
      let newBudget = oldBudget.budget - totalCost;
      await user.budgetUpdate(newBudget, req.user.email);
      res.sendStatus(201);
    } catch {
      console.log("errore");
      res.sendStatus(400);
    }
  };

  public solveModel = async (req, res) => {
    let modelSolve: any = await model.checkExistingModel(
      req.body.name,
      req.body.version
    );
    let stringModel: string = JSON.stringify(modelSolve);
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
    console.log(modelnewstring);
    let modelJSON = JSON.parse(modelnewstring)

    let solveModel = glpk.solve(modelJSON, options);
  };
}
export default ModelController;
