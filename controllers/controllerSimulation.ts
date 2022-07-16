import { resolveSoa } from "dns";
import { Result } from "glpk.js";
import { getModels, getSpecificModel } from "../model/Model";

const GLPK = require("glpk.js");
const glpk = GLPK();

export class SimulationController {
  public doSimulation = async (req, res) => {
    try {
      let solve: Array<JSON> = [];
      let objectiveVars = combinationFunctionObjective(req.body.objective);
      let subjectToComb = combinationFunctionSubjectTo(req.body.subjectTo);
      let model: any = await getSpecificModel(req.body.name, req.body.version);
      model = this.filtraJSON(model);
      for (const elem of objectiveVars) {
        for (const raw of elem) {
          for (const item of model.objective.vars) {
            if (item.name == raw.name) {
              item["coef"] = raw.value;
            }
          }
        }
        model.objective.vars.forEach((item) => console.log(item));
        let solution = glpk.solve(model);
        solve.push(solution);
      }
      res.send(solve);
    } catch {
      res.sendStatus(404);
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
