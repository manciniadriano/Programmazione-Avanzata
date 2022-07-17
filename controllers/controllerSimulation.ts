import { getSpecificModel } from "../model/Model";
import { getBudget } from "../model/User";
import * as user from "../model/User";
import * as help from "../middleware/helpFunction/middleModFun";
import * as helpSim from "./helpSimulation/helpSimulation"
const GLPK = require("glpk.js");
const glpk = GLPK();

export class SimulationController {
  public doSimulation = async (req, res) => {
    try {
      let solve: Array<JSON> = [];
      let c: number = 0;
      if (req.body.objective!== undefined && req.body.subjectTo!== undefined) {
        var objectiveVars = combinationFunctionObjective(req.body.objective);
        var subjectToComb = combinationFunctionSubjectTo(req.body.subjectTo);
        c = 3;
      } else if (req.body.objective !== undefined) {
        var objectiveVars = combinationFunctionObjective(req.body.objective);
        c = 1;
      } else {
        var subjectToComb = combinationFunctionSubjectTo(req.body.subjectTo);
        c = 2;
      }
      console.log(c);
      let model: any = await getSpecificModel(req.body.name, req.body.version);
      /*let modelCost = model.cost;
      let budgetUser: any = await getBudget(req.user.email);
      if (
        budgetUser.budget <
        totalCostSimulation(objectiveVars, subjectToComb, modelCost)
      ) {
        throw "Unauthorized";
      } else {
        let newBudget =
          budgetUser.budget -
          totalCostSimulation(objectiveVars, subjectToComb, modelCost);
        await user.budgetUpdate(newBudget, req.user.email);
      }*/
      console.log(c);
      switch(c) {
        case 1: helpSim.simulationWithObj(objectiveVars, model, solve); break;
        case 2: helpSim.simulationWithSub(subjectToComb, model, solve); break;
        case 3: helpSim.simulationWithObjSub(objectiveVars, subjectToComb, model, solve); break;
      }
      res.send(solve);
    } catch (e) {
        res.sendStatus(401);
    }
  };
}

const combinationFunctionObjective = (objective: any) => {
  var array = [];

  objective.map((elem) => {
    let appoggio = [];
    let i = Math.round((elem.end - elem.start) / elem.step); // numero di step
    for (var n = 0; n <= i; n++) {
      var object = { name: elem.name, value: elem.start + elem.step * n };
      appoggio.push(object);
    }
    array.push(appoggio);
  });
  const cartesian = (...f) =>
    f
      .map((a) =>
        a.reduce((a, b) => a.flatMap((d) => b.map((e) => [d, e].flat())))
      )
      .flat();

  let output = cartesian(array);
  return output;
};

const combinationFunctionSubjectTo = (objective: any) => {
  var array = [];
  objective.map((elem) => {
    elem.vars.forEach((item) => {
      let appoggio = [];
      let i = Math.round((item.end - item.start) / item.step);
      for (var n = 0; n <= i; n++) {
        var object = {
          namesubject: elem.name,
          name: item.name,
          value: item.start + item.step * n,
        };
        appoggio.push(object);
      }
      array.push(appoggio);
    });
  });

  const cartesian = (...f) =>
    f
      .map((a) =>
        a.reduce((a, b) => a.flatMap((d) => b.map((e) => [d, e].flat())))
      )
      .flat();

  let output = cartesian(array);
  return output;
};

const totalCostSimulation = (
  objective: any,
  subject: any,
  cost: number
): number => {
  let output = cartesian([subject], [objective]);
  let final = cartesianProduct(output[0], output[1]);
  return final.length * cost;
};

const cartesian = (...f) =>
  f.map((a) =>
    a.reduce((a, b) => a.flatMap((d) => b.map((e) => [d, e].flat())))
  );

function cartesianProduct(...arrays) {
  return [...arrays].reduce(
    (a, b) =>
      a.map((x) => b.map((y) => x.concat(y))).reduce((a, b) => a.concat(b), []),
    [[]]
  );
}
