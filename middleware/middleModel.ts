import * as mf from "./helpFunction/middleModFun";
import { LP } from "glpk.js";

/**
 * Middleware per validare la richiesta, con opportuni messaggi di errore
 * @param req request
 * @param res response
 * @param next
 */
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

/**
 * Funzione per validare la richiesta della creazione del nuovo modello
 * con opportuni conrtolli sui diversi campi
 * @param model modello della richiesta
 * @returns true o false se il modello è scritto correttamente
 */
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

/**
 * Middleware per la richiesta di filtro dei model
 * @param req request
 * @param res response
 * @param next 
 * {
    "numvars": 2,
    "numsub":3,
    "continuous": 1,
    "generals": 1,
    "binaries": 0
}
 */
export const filterModels = (req: any, res: any, next: any) => {
  try {
    if (
      Number.isInteger(req.body.numvars) &&
      req.body.numvars >= 0 &&
      Number.isInteger(req.body.numsub) &&
      req.body.numsub >= 0 &&
      Number.isInteger(req.body.continuous) &&
      (req.body.continuous === 1 || req.body.continuous === 0) &&
      Number.isInteger(req.body.generals) &&
      (req.body.generals === 1 || req.body.generals === 0) &&
      Number.isInteger(req.body.binaries) &&
      (req.body.binaries === 1 || req.body.binaries === 0)
    ) {
      next();
    } else {
      res.sendStatus(400);
    }
  } catch {
    res.sendStatus(400);
  }
};
