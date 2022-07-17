import { nextTick } from "process";
import * as Model from "../model/Model";
import * as User from "../model/User";

/*{
  "name" : "ri",
  "version" : 1
}
*/

/**
 * Funzione per validare la richiesta per la solve sia corretta, sia per i tipi sia per l'esistenza del modello nel db
 * @param req richiesta
 * @param res risposta
 * @param next
 */
export async function checkSolve(req: any, res: any, next: any) {
  if (
    req.body.name &&
    typeof req.body.name === "string" &&
    req.body.version &&
    Number.isInteger(req.body.version)
  ) {
    if (await Model.checkExistingModel(req.body.name, req.body.version)) {
      next();
    } else {
      res.sendStatus(404);
    }
  } else {
    res.sendStatus(400);
  }
}

/**
 * Verifica che l'utente abbia abbastanza soldi per effettuare la solve del modello
 * @param req richiesta
 * @param res risposta
 * @param next
 */
export async function checkCreditoSolve(req: any, res: any, next: any) {
  const budget: any = await User.getBudget(req.user.email);
  const cost: any = await Model.checkExistingModel(
    req.body.name,
    req.body.version
  );
  if (budget.budget > cost.cost) {
    next();
  } else {
    res.sendStatus(401);
  }
}

/**
 * Verifica la validità della richiesta per la simulazione
 * @param req request
 * @param res response
 * @param next
 */
export async function checkDoSimulation(req: any, res: any, next: any) {
  try {
    if (
      req.body.name != undefined &&
      typeof req.body.name === "string" &&
      req.body.version != undefined &&
      Number.isInteger(req.body.version)
    ) {
      //Controllo per le variabili della funzione obiettivo
      if (req.body.objective != undefined && checkVarsSim(req.body.objective)) {
      } else {
        throw "Bad Request";
      }

      //Controllo per gli oggetti della subjectTo
      if (req.body.subjectTo != undefined) {
        req.body.subjectTo.forEach((item) => {
          if (checksubjectToSim(item)) {
          } else {
            throw "Bad Request";
          }
        });
      }

      next();
    } else {
      throw "Bad Request";
    }
  } catch (e) {
    res.sendStatus(400);
  }
}

/**
 * Funzione che verifica che l'oggetto vars per la simulazione sia scritto in maniera corretta
 * @param vars
 * @returns
 */
const checkVarsSim = (vars) => {
  let check: boolean = true;
  vars.forEach((item) => {
    if (
      item.name &&
      typeof item.name === "string" &&
      item.start &&
      typeof item.start === "number" &&
      item.end &&
      typeof item.end === "number" &&
      item.step &&
      typeof item.step === "number" &&
      item.start < item.end
    ) {
    } else {
      check = false;
    }
  });
  return check;
};

/**
 * Funzione per verificare che gli oggetti della subjectTo siano scritti in maniera corretta
 * @param item
 * @returns
 */
const checksubjectToSim = (item) => {
  if (item.name && typeof item.name === "string" && checkVarsSim(item.vars)) {
    return true;
  } else {
    return false;
  }
};

