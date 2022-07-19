import { filtraJSON } from "../middleware/helpFunction/middleModFun";

const GLPK = require("glpk.js");
const glpk = GLPK();

interface doSimulation {
  doSimulation(a, b, c);
}

class ConcreteSimulationOnlyObj implements doSimulation {
  /**
 * Funzione per risolvere i modelli dove vengono modificati solo i coefficienti della funzione obiettivo
 * @param objectiveComb combinazioni dei coefficienti dei diversi modelli da calcolare
 * @param model modello su cui effettuare il calcolo
 * @param solve array delle soluzioni
 */
  public doSimulation(objectiveComb, model, solve) {
    model = filtraJSON(model);
    var bestModel: string = null;
    objectiveComb.map((a) => {
      model.objective.vars.map((c) => {
        a.map((b) => {
          if (c.name === b.name) {
            c.coef = b.value;
          }
        });
      });
      let solution = glpk.solve(model);
      switch (model.objective.direction) {
        case 1: {
          let min = Math.min(...solve.map((item: any) => item.result.z));
          if (bestModel === null && solve.length === 0) {
            bestModel = JSON.stringify(model); //assegno con una stringa per non passare il riferimento dell'oggetto
          } else if (solution.result.z < min) {
            bestModel = JSON.stringify(model);
          }
          break;
        }
        case 2: {
          let max = Math.max(...solve.map((item: any) => item.result.z));
          if (bestModel == null && solve.length == 0) {
            bestModel = JSON.stringify(model);
          } else if (solution.result.z > max) {
            bestModel = JSON.stringify(model);
          }
          break;
        }
      }
      solve.push(solution);
    });
    bestModel = JSON.parse(bestModel);
    solve.push(bestModel);
  }
}

class ConcreteSimulationOnlySub implements doSimulation {
  /**
 * Funzione per modificare solamente i coef dei vincoli
 * @param subjectComb combinazioni dei diversi coefficienti per il modello da calcolare
 * @param model modello su cui effettuare il calcolo
 * @param solve array delle soluzioni
 */
  public doSimulation(subjectComb, model, solve) {
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
      let solution = glpk.solve(model);
      switch (model.objective.direction) {
        case 1: {
          let min = Math.min(...solve.map((item: any) => item.result.z));
          if (bestModel === null && solve.length === 0) {
            bestModel = JSON.stringify(model); //assegno con una stringa per non passare il riferimento dell'oggetto
          } else if (solution.result.z < min) {
            bestModel = JSON.stringify(model);
          }
          break;
        }
        case 2: {
          let max = Math.max(...solve.map((item: any) => item.result.z));
          if (bestModel == null && solve.length == 0) {
            bestModel = JSON.stringify(model);
          } else if (solution.result.z > max) {
            bestModel = JSON.stringify(model);
          }
          break;
        }
      }
      solve.push(solution);
    });
    bestModel = JSON.parse(bestModel);
    solve.push(bestModel);
  }
}

class ConcreteSimulationObjSub implements doSimulation {
  /**
 * Funzione per risolvere i modelli dove vengono modificati sia funzione obiettivo che vincoli
 * @param allObject array di array di oggetti, ogni oggetto contiene una combinazione tra var obiettivo e var vincoli
 * @param model modello da risolvere
 * @param solve array dove pushare le soluzioni
 */
  public doSimulation(allObject, model, solve) {
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
      let solution = glpk.solve(model);
      switch (model.objective.direction) {
        case 1: {
          let min = Math.min(...solve.map((item: any) => item.result.z));
          if (bestModel === null && solve.length === 0) {
            bestModel = JSON.stringify(model); //assegno con una stringa per non passare il riferimento dell'oggetto
          } else if (solution.result.z < min) {
            bestModel = JSON.stringify(model);
          }
          break;
        }
        case 2: {
          let max = Math.max(...solve.map((item: any) => item.result.z));
          if (bestModel == null && solve.length == 0) {
            bestModel = JSON.stringify(model);
          } else if (solution.result.z > max) {
            bestModel = JSON.stringify(model);
          }
          break;
        }
      }
      solve.push(solution);
    });
    bestModel = JSON.parse(bestModel);
    solve.push(bestModel);
  }
}

export class SimulationFactory {
  getSimulation(type: number): doSimulation {
    let retval: doSimulation = null;
    switch (type) {
      case 1:
        retval = new ConcreteSimulationOnlyObj();
        break;
      case 2:
        retval = new ConcreteSimulationOnlySub();
        break;
      case 3:
        retval = new ConcreteSimulationObjSub();
        break;
    }
    return retval;
  }
}
