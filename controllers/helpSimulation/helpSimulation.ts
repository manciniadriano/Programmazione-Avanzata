import { createSolutionBuilder } from "typescript";
import { filtraJSON } from "../../middleware/helpFunction/middleModFun";

const GLPK = require("glpk.js");
const glpk = GLPK();

/**
 * {
    "name": "lp",
    "version": 1,
    "objective": [
                {
                    "name": "x1",
                    "start": 0.9,
                    "end": 1.0,
                    "step": 0.1
                }

    ]
    "subjectTo": [
        {
            "name": "cons1",
            "vars": [
                {
                    "name": "x1",
                    "start": 0.9,
                    "end": 1.0,
                    "step": 0.1
                }
            ]
        },
        {
            "name": "cons1",
            "vars": [
                {
                    "name": "x2",
                    "start": 0.9,
                    "end": 1.0,
                    "step": 0.1
                }
            ]
        },
        {
            "name": "cons2",
            "vars": [
                {
                    "name": "x1",
                    "start": 2.0,
                    "end": 2.1,
                    "step": 0.1
                }
            ]
        }
    ]
}
 */
export const simulationWithObjSub = (
  objectiveVars,
  subjectToComb,
  model,
  solve
) => {
  model = filtraJSON(model);
  var bestModel: string = null;
  for (const elem of objectiveVars) {
    for (const itemelem of elem) {
      for (const item of model.objective.vars) {
        if (item.name == itemelem.name) {
          item["coef"] = itemelem.value;
        }
      }
    }
    for (const subcomb of subjectToComb) {
      for (const elem of subcomb) {
        for (const item of model.subjectTo) {
          if (item.name == elem.namesubject) {
            for (const varsub of item.vars) {
              if (varsub.name == elem.name) {
                varsub["coef"] = elem.value;
              }
            }
          }
        }
      }
      console.log("vars model finali obiettivo: " + JSON.stringify(model.objective.vars));
      console.log("vars subjectto finali: " + JSON.stringify(model.subjectTo));
      let solution = glpk.solve(model);
      if (model.objective.direction == 1) {
        let min = Math.min(...solve.map((item: any) => item.result.z));
        if (bestModel == null && solve.length == 0) {
          //stringa per non creare un passaggio del modello per riferimento
          bestModel = JSON.stringify(model);
        } else if (solution.result.z < min) {
          bestModel = JSON.stringify(model);
        }
      }

      if (model.objective.direction == 2) {
        let max = Math.max(...solve.map((item: any) => item.result.z));
        if (bestModel == null && solve.length == 0) {
          bestModel = JSON.stringify(model);
        } else if (solution.result.z > max) {
          bestModel = JSON.stringify(model);
        }
      }
      solve.push(solution);
    }
  }
  let object = JSON.parse(bestModel);
  solve.push(object);
};

export const simulationWithObj = (objectiveVars, model, solve) => {
  var bestModel: string = null;
  for (const elem of objectiveVars) {
    for (const item of model.objective.vars) {
      if (item.name == elem.name) {
        item["coef"] = elem.value;
      }
    }
    let options = JSON.stringify(model.options);
    model = filtraJSON(model);
    console.log(JSON.stringify(model));
    console.log(options);
    let solution = glpk.solve(model, options);
    if (model.objective.direction == 1) {
      let min = Math.min(...solve.map((item: any) => item.result.z));
      if (bestModel == null && solve.length == 0) {
        bestModel = JSON.stringify(model);
      } else if (solution.result.z < min) {
        bestModel = JSON.stringify(model);
      }
    }

    if (model.objective.direction == 2) {
      let max = Math.max(...solve.map((item: any) => item.result.z));
      if (bestModel == null && solve.length == 0) {
        bestModel = JSON.stringify(model);
      } else if (solution.result.z > max) {
        //scelta della stringa poiché con oggetti passaggio per riferimento
        bestModel = JSON.stringify(model);
      }
    }
    solve.push(solution);
  }
  let object = JSON.parse(bestModel);

  solve.push(object);
};

export const simulationWithSub = (subjectToComb, model, solve) => {
  var bestModel: string = null;
  model = filtraJSON(model);
  for (const subcomb of subjectToComb) {
    for (const element of subcomb) {
      for (const item of model.subjectTo) {
        if (item.name == element.namesubject) {
          for (const varsub of item.vars) {
            console.log("model: " + varsub.name + varsub.coef);
            console.log("vincolo: " + element.name + element.value);
            if (varsub.name == element.name) {
              varsub["coef"] = element.value;
            }
          }
        }
      }
    }
    console.log(JSON.stringify(model));
    let solution = glpk.solve(model);
    if (model.objective.direction == 1) {
      let min = Math.min(...solve.map((item: any) => item.result.z));
      if (bestModel == null && solve.length == 0) {
        bestModel = JSON.stringify(model);
      } else if (solution.result.z < min) {
        bestModel = JSON.stringify(model);
      }
    }

    if (model.objective.direction == 2) {
      let max = Math.max(...solve.map((item: any) => item.result.z));
      if (bestModel == null && solve.length == 0) {
        bestModel = JSON.stringify(model);
      } else if (solution.result.z > max) {
        //scelta della stringa poiché con oggetti passaggio per riferimento
        bestModel = JSON.stringify(model);
      }
    }
    solve.push(solution);
  }
  let object = JSON.parse(bestModel);
  solve.push(object);
};
