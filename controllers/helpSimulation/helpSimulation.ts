import { filtraJSON } from "../../middleware/helpFunction/middleModFun";

const GLPK = require("glpk.js");
const glpk = GLPK();


/**
 * Funzione per risolvere i modelli dove vengono modificati sia funzione obiettivo che vincoli
 * @param allObject array di array di oggetti, ogni oggetto contiene una combinazione tra var obiettivo e var vincoli
 * @param model modello da risolvere
 * @param solve array dove pushare le soluzioni
 */
export const simulationWithObjSub = (allObject, model, solve) => {
  model = filtraJSON(model);
  var bestModel: string = null;
  allObject.map((a) => {
    model.objective.vars.map((c) => {
      a.map((b) => {
        if (b.namesubject === undefined && c.name === b.name) {
          c.coef = b.value;
        }
      });
    });
    model.subjectTo.map((c) => {
      c.vars.map((d) => {
        a.map((b) => {
          if (
            b.namesubject !== undefined &&
            d.name === b.name &&
            b.namesubject === c.name
          ) {
            d.coef = b.value;
          }
        });
      });
    });
    //console.log(JSON.stringify(model));
    let solution = glpk.solve(model);
    switch (model.objective.direction) {
      case 1: {
        let min = Math.min(...solve.map((item: any) => item.result.z));
        if (bestModel === null && solve.length === 0) {
          bestModel = JSON.stringify(model); //assegno con una stringa per non passare il riferimento dell'oggetto
        } else if (solution.result.z < min) {
          bestModel = JSON.stringify(model);
        }
      }
      case 2: {
        let max = Math.max(...solve.map((item: any) => item.result.z));
        if (bestModel == null && solve.length == 0) {
          bestModel = JSON.stringify(model);
        } else if (solution.result.z > max) {
          bestModel = JSON.stringify(model);
        }
      }
    }
    solve.push(solution);
  });
  bestModel = JSON.parse(bestModel);
  solve.push(bestModel);
};

/**
 * Funzione per risolvere i modelli dove vengono modificati solo i coefficienti della funzione obiettivo
 * @param objectiveComb combinazioni dei coefficienti dei diversi modelli da calcolare
 * @param model modello su cui effettuare il calcolo
 * @param solve array delle soluzioni
 */
export const simulationOnlyObjective = (objectiveComb, model, solve) => {
  model = filtraJSON(model);
  var bestModel = null;
  objectiveComb.map((a) => {
    model.objective.vars.map((c) => {
      a.map((b) => {
        if (c.name === b.name) {
          c.coef = b.value;
        }
      });
    });
    console.log(JSON.stringify(model));
    let solution = glpk.solve(model);
    switch (model.objective.direction) {
      case 1: {
        let min = Math.min(...solve.map((item: any) => item.result.z));
        if (bestModel === null && solve.length === 0) {
          bestModel = JSON.stringify(model); //assegno con una stringa per non passare il riferimento dell'oggetto
        } else if (solution.result.z < min) {
          bestModel = JSON.stringify(model);
        }
      }
      case 2: {
        let max = Math.max(...solve.map((item: any) => item.result.z));
        if (bestModel == null && solve.length == 0) {
          bestModel = JSON.stringify(model);
        } else if (solution.result.z > max) {
          bestModel = JSON.stringify(model);
        }
      }
    }
    solve.push(solution);
  });
  bestModel = JSON.parse(bestModel);
  solve.push(bestModel);
};


/**
 * Funzione per modificare solamente i coef dei vincoli
 * @param subjectComb combinazioni dei diversi coefficienti per il modello da calcolare
 * @param model modello su cui effettuare il calcolo
 * @param solve array delle soluzioni
 */
export const simulationOnlySubject = (subjectComb, model, solve) => {
  console.log(JSON.stringify(subjectComb))
  model = filtraJSON(model);
  var bestModel: string = null;
  subjectComb.map((a) => {
    model.subjectTo.map((c) => {
      c.vars.map((d) => {
        a.map((b) => {
          if (
            b.namesubject !== undefined &&
            d.name === b.name &&
            b.namesubject === c.name
          ) {
            d.coef = b.value;
          }
        });
      });
    });
    //console.log(JSON.stringify(model))
    let solution = glpk.solve(model);
    switch (model.objective.direction) {
      case 1: {
        let min = Math.min(...solve.map((item: any) => item.result.z));
        if (bestModel === null && solve.length === 0) {
          bestModel = JSON.stringify(model); //assegno con una stringa per non passare il riferimento dell'oggetto
        } else if (solution.result.z < min) {
          bestModel = JSON.stringify(model);
        }
      }
      case 2: {
        let max = Math.max(...solve.map((item: any) => item.result.z));
        if (bestModel == null && solve.length == 0) {
          bestModel = JSON.stringify(model);
        } else if (solution.result.z > max) {
          bestModel = JSON.stringify(model);
        }
      }
    }
    solve.push(solution);
  });
  bestModel = JSON.parse(bestModel);
  solve.push(bestModel);
};

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