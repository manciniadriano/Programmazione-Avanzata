import { filtraJSON } from "../../middleware/helpFunction/middleModFun";

const GLPK = require("glpk.js");
const glpk = GLPK();


export const simulationWithObjSub = (
  objectiveVars,
  subjectToComb,
  model,
  solve
) => {
  var bestModel: string = null;
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
      }
      let solution = glpk.solve(model);
      if (model.objective.direction == 1) {
        if (
          solution.result.z <
            Math.min(...solve.map((item: any) => item.result.z)) ||
          bestModel == null
        ) {
          bestModel = model;
        }
      }

      if (model.objective.direction == 2) {
        let max = Math.max(...solve.map((item: any) => item.result.z));
        if (bestModel == null && solve.length == 0) {
          bestModel = JSON.stringify(model);
          console.log("caso base");
        } else if (solution.result.z > max) {
          //scelta della stringa poiché con oggetti passaggio per riferimento
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
  for (const subcomb of subjectToComb) {
    for (const item of model.subjectTo) {
      if (item.name == subcomb.namesubject) {
        for (const varsub of item.vars) {
          if (varsub.name == subcomb.name) {
            varsub["coef"] = subcomb.value;
          }
        }
      }
    }

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
