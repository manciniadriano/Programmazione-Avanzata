import { nextTick } from "process";
import * as Model from "../model/Model";
import * as User from "../model/User";

export async function checkSolve(req, res, next) {
  if (await Model.checkExistingModel(req.body.name, req.body.version)) {
    next();
  } else {
    res.sendStatus(404);
  }
}

export async function checkCreditoSolve(req, res, next) {
  const budget: any = await User.getBudget(req.user.email);
  const cost: any = await Model.checkExistingModel(
    req.body.name,
    req.body.version
  );
  console.log(cost.cost)
  if (budget.budget > cost.cost) {
    next();
  } else {
    res.sendStatus(401);
  }
}
