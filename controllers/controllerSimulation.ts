import { getSpecificModel } from "../model/Model";
import { getBudget } from "../model/User";
import * as user from "../model/User";
import * as help from "../middleware/helpFunction/middleModFun";
import * as helpSim from "./helpSimulation/helpSimulation";
import * as factory from "./abstractSimulation";
const GLPK = require("glpk.js");
const glpk = GLPK();

export class SimulationController {

  /**
   * Funzione per effettuare le simulazioni
   * @param req request
   * @param res response
   */
  public doSimulation = async (req, res) => {
    try {
      let solve: Array<JSON> = [];
      let c: number = 0;
      //caso in cui vengono specificati sia cambiamenti nella funzione obiettivo che nei vincoli
      if ( req.body.objective !== undefined && req.body.subjectTo !== undefined) {
        var objectiveVars = combinationFunctionObjective(req.body.objective);
        var subjectToComb = combinationFunctionSubjectTo(req.body.subjectTo);
        var allObject = cartesianComb(objectiveVars, subjectToComb);
        c = 3;
      } 
      //casp in cui viene modificata solamente la funzione obiettivo
      else if (req.body.objective !== undefined) {
        var allObject = null;
        /*controllo per verificare che sia solo un elemento poiché la fuzione cominationFunctionObjective
        * in tal caso non restituisce un array di array, formato accettato dalla funzione che calcola le soluzioni
        *
        */
        if (req.body.objective.length == 1) {
          allObject = splitArray(
            combinationFunctionObjective(req.body.objective)
          );
        } else {
          var allObject = combinationFunctionObjective(req.body.objective);
        }
        c = 1;
      } else {
        /**caso analogo per il modifiche solo della obiettivo, in cui se speficato il cambiamento in un unico vincolo
         * in un'unica variabile non viene creato l'array di array
         *  
         * */ 
        if (req.body.subjectTo.length === 1) {
          req.body.subjectTo.map((a) => { if (a.vars.length == 1) {
          allObject = splitArray(combinationFunctionSubjectTo(req.body.subjectTo))
          } else {allObject = combinationFunctionSubjectTo(req.body.subjectTo)}})
        } else {
        var allObject = combinationFunctionSubjectTo(req.body.subjectTo);
        }
        c = 2;
      }
      let model: any = await getSpecificModel(req.body.name, req.body.version);
      let factorySim: factory.SimulationFactory = new factory.SimulationFactory();
      let prova = factorySim.getSimulation(c);
      prova.doSimulation(allObject,model,solve);
      res.send(solve);
    } catch (e) {
      res.sendStatus(404);
    }
  };
}

/**
 * Creazione delle combinazioni per le variazioni dei coefficienti della funzione obiettivo
 * @param objective array col le specifiche di variazione dei coef
 * @returns combinazioni delle modifiche sui vincoli 
 */
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

  let output = cartesianObjective(array);
  return output;
};

/**
 * Creazione delle combinazioni per le variazioni dei coefficienti dei vincoli
 * @param objective array col le specifiche di variazione dei coef
 * @returns combinazioni delle modifiche sui vincoli
 */
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

  let output = cartesianObjective(array);
  return output;
};

/**
 * funzione ausiliaria per casi particolari delle combinazioni sia dei vincoli che della funzione obiettivo
 * @param a array da modificare dei vincoli o della funzione obiettivo
 * @returns array con giusta formattazione per il calcolo dei modelli
 */
const splitArray = (a) => {
  let array = [];
  a.map((b) => {
    array.push([b]);
  });
  return array;
};

/**
 * prodotto cartesiano per generare le combinazioni nei vincoli e nella funzione obiettivo
 * @param a array su cui fare le combinazioni
 * @returns tutte le combinazioni dei coef vincol||funzione obiettivo
 */
const cartesianObjective = (a) =>
  a.reduce((a, b) => a.flatMap((d) => b.map((e) => [d, e].flat())));

/**
 * Prodotto cartesiano per generare le combinazioni tra i vincoli e la funzione obiettivo
 * @param array primo array
 * @param array2 secondo array
 * @returns combinazioni tra coef dei vincoli e della fun obiettivo
 */
const cartesianComb = (array, array2) =>
  array.flatMap((a) => array2.map((b) => [a, b].flat()));
