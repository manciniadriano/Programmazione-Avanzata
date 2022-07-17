import { resolveSoa } from "dns";
import { Result } from "glpk.js";
import { checkCredito } from "../middleware/middleAuth";
import { getModels, getSpecificModel } from "../model/Model";
import { getBudget } from "../model/User";
import * as user from "../model/User";
import { arrayBuffer } from "stream/consumers";

const GLPK = require("glpk.js");
const glpk = GLPK();

export class SimulationController {
  public doSimulation = async (req, res) => {
    try {
      let solve: Array<JSON> = [];
      let objectiveVars = combinationFunctionObjective(req.body.objective);
      let subjectToComb = combinationFunctionSubjectTo(req.body.subjectTo);
      let model: any = await getSpecificModel(req.body.name, req.body.version);
      let modelCost = model.cost;
      let budgetUser: any = await getBudget(req.user.email);
      console.log(totalCostSimulation(objectiveVars, subjectToComb, modelCost));
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
      }
      model = this.filtraJSON(model);
      let bestModel: any = null;
      for (const elem of objectiveVars) {
        for (const item of model.objective.vars) {
          if (item.name == elem.name) {
            item["coef"] = elem.value;
          }
        }
        for (const subcomb of subjectToComb) {
          for (const item of model.subjectTo) {
            if (item.name == subcomb.namesubject) {
              for (const varsub of item.vars) {
                if (varsub.name == subcomb.name) {
                  varsub["coef"] = subcomb.value;
                }
              }
            }
            model.objective.vars.map((item) =>
              console.log("obj name: " + item.name + "   item.coef" + item.coef)
            );
            model.subjectTo.map((item) =>
              item.vars.map((item) =>
                console.log(
                  "item.name vincolo" + item.name + "  item.coef" + item.coef
                )
              )
            );
            let solution = glpk.solve(model);
            if (model.objective.direction == 1) {
              console.log(solution.result.z);
              if (
                solution.result.z <
                solve.map((item: any) => Math.min(item.result.z))
              ) {
                bestModel = model;
              }
            }

            if (model.objective.direction == 2) {
              console.log(solution.result.z);
              if (
                solution.result.z >
                solve.map((item: any) => Math.max(item.result.z))
              ) {
                bestModel = model;
              }
            }
            solve.push(solution);
          }
        }
        solve.push(bestModel);
        res.send(solve);
      }
    } catch (e) {
      if (e == "Unauthorized") {
        res.sendStatus(401);
      } else {
        res.sendStatus(400);
      }
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
