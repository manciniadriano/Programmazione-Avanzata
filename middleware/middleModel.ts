import * as mf from "./helpFunction/middleModFun";
import { LP } from "glpk.js";

export async function newModelValidation(req: any, res: any, next: any) {
  try {
    let response = await validationModel(req.body);
    if (response) {
      console.log("Richiesta ben formata");
      next();
    } else {
      res.sendStatus(400); //Bad Request
    }
  } catch (error) {
    res.sendStatus(403);
  }
}

const validationModel = (model: any): boolean => {
  if (
    mf.checkName(model.name) &&
    mf.checkObjective(model.objective) &&
    mf.checkSubjectTo(model.subjectTo) &&
    mf.checkBounds(model.bounds) &&
    mf.checkBinariesGenerals(model.binaries, model.objective.vars) &&
    mf.checkBinariesGenerals(model.generals, model.objective.vars) &&
    mf.checkBinGenOverlap(model.binaries, model.generals)
  ) {
    return true;
  } else {
    return false;
  }
};