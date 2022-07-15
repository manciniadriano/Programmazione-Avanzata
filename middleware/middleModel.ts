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

const validationModel = (body: any): boolean => {
  if (
    mf.checkName(body.name) &&
    mf.checkObjective(body.objective) &&
    mf.checkSubjectTo(body.subjectTo)
  ) {
    return true;
  } else {
    return false;
  }
};