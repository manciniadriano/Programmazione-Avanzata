import { resolveSoa } from "dns";
import { Result } from "glpk.js";
import { getModels, getSpecificModel } from "../model/Model";

const GLPK = require("glpk.js");
const glpk = GLPK();

export class SimulationController {
  public doSimulation = async (req, res) => {
    try {
      let solve: Array<JSON> = [];
      let counter: number= 1;
      let model: any = await getSpecificModel(req.body.name, req.body.version);
      for (const item of model.objective.vars) {
        for (const objective of req.body.objective) {
          if (item.name == objective.name) {
            item["coef"] = objective.start*counter;
          }
        }
      }
      model = this.filtraJSON(model);
      let solution = glpk.solve(model);
      solve.push(solution);
      res.send(solution);
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

