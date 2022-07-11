import * as user  from "../model/User"
import * as auth  from "../middleware/middleAuth";
import * as model from "../model/Model"
import { Model } from "sequelize/types";


var glpk = require("glpk.js")

export class ModelController {
  public insertNewModel = async (req,res) => {
    try {
      console.log("reqbody: " + req.body);
      let totalCost: number = auth.costContraint(req.body) + auth.checkBinOrInt(req.body);
      await model.insertModel(req.body, totalCost);
      let oldBudget: any = await user.getBudget(req.user.email);
      let newBudget = oldBudget.budget - totalCost;
      await user.budgetUpdate(newBudget,req.user.email)
      res.sendStatus(201);
    } catch {
      console.log("errore")
      res.sendStatus(400);
    }
  }

  public solveModel = async (req, res) => {
    let modelSolve: any = await model.checkExistingModel(
      req.body.name,
      req.body.version
    );
    let stringModel : string = JSON.parse(modelSolve);
    var solveModel = glpk.solve(stringModel);
    console.log(solveModel);
  }
} 
export default ModelController;