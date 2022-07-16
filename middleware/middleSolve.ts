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
export async function checkSolve(req, res, next) {
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
export async function checkCreditoSolve(req, res, next) {
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
