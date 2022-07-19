import * as user from "../model/User";
import * as auth from "../middleware/middleAuth";
import * as model from "../model/Model";
import { filtraJSON } from "../middleware/helpFunction/middleModFun";

const GLPK = require("glpk.js");
const glpk = GLPK();

export class ModelController {
  public insertNewModel = async (req, res) => {
    try {
      let totalCost: number =
        auth.costContraint(req.body) + auth.checkBinOrInt(req.body); // calcoliamo il costo come somma dei costi dei vincoli e delle variabili
      var flag = await model.insertModel(req.body, totalCost);
      if (flag) {
        let oldBudget: any = await user.getBudget(req.user.email);
        let newBudget = oldBudget.budget - totalCost;
        await user.budgetUpdate(newBudget, req.user.email); // aggiorniamo il budget dell'utente, sottraendogli il costo del modello.
        res.sendStatus(201);
      } else {       
        res.sendStatus(400);
      }
    } catch {
      res.sendStatus(400);
    }
  };

  

  public solveModel = async (req, res) => {
    try {
      let modelSolve: any = await model.checkExistingModel(
        req.body.name,
        req.body.version
      );
      let options = JSON.stringify(modelSolve.options);
      let filtrato = filtraJSON(modelSolve);
      
      let oldBudget : any = await user.getBudget(req.user.email)
      let newBudget= oldBudget.budget - modelSolve.cost;
      await user.budgetUpdate(newBudget, req.user.email); // aggiorniamo il budget dell'utente, sottraendogli il costo del modello.
      let solveModel = glpk.solve(filtrato, options);
      res.status(200).json(solveModel);
    } catch (e) {    
      res.sendStatus(400);
    }
  };

  /**
   * Ricarica nel db del credito dello user
   * @param req request
   * @param res response
   */
  public creditCharge = async (req, res) => {
    try {
      if (Number(req.user.budget) > 0) {
        let oldBudget: any = await user.getBudget(req.user.emailuser);
        let newBudget = oldBudget.budget + Number(req.user.budget);
        user.budgetUpdate(newBudget, req.user.emailuser); // aggiorniamo il budget dell'utente, sommando quanto dato dall'admin
        res.sendStatus(200);
      } else {
        res.sendStatus(400);
      }
    } catch {
      res.sendStatus(400);
    }
  };

/**
 * qui si filtrano i modelli in base a ciò che si vuole:
 * numero di variabili: numvars
 * numero di vincoli: numsub
 * presenza o meno di variabili intere, binarie, continue: generals, binaries, continuous.
 * Si può lasciare vuoto il campo, non verrà filtrato su di esso
 * @param req request
 * @param res response
 */
public filterPlus1 = async (req, res) => {
  
  try {
    let models: any = await model.getModels();
    let modelsF: any = models
      .map((item) => filtraJSON(item))
      .filter((item) => {
        if (req.body.numvars) {
          return item.objective.vars.length === req.body.numvars; // verifichiamo sulla base della lunghezza del vettore delle variabili
        } else return true;
      })
      .filter((item) => {
        if (req.body.numsub) {
          return item.subjectTo.length === req.body.numsub;  // verifichiamo sulla base della lunghezza del vettore dei vincoli
        } else return true;
      })
      .filter((item) => {
        if(req.body.binaries !== undefined){
          if(req.body.binaries===0){
            return item.binaries === undefined // se binaries è settato a 0 voglio solo i modelli che hanno binaries undefined
          } else return item.binaries !== undefined
        } else return true;
      })
      .filter((item) => {
        if(req.body.generals !== undefined){
          if(req.body.generals===0){
            return item.generals === undefined  // se generals è settato a 0 voglio solo i modelli che hanno generals undefined
          } else return item.generals !== undefined
        } else return true;
      })
      .filter((item)=>{
        if(req.body.continuous !== undefined){
          if(req.body.continuous===0){

            /*
            se continuous è settato a 0 voglio che tutte le variabili siano dentro binaries e generals,
            quindi in base al caso in cui mi trovo controllo se la condizione è verificata o meno.
            con il continuous settato a 1 è speculare, metto il minore per verificare che alcune
            variabili non siano né in generals né in binaries, ovvero siano continue.
            */

            if((item.binaries === undefined) && (item.generals === undefined)) return false;
            if((item.binaries === undefined) && (item.generals !== undefined)) return item.generals.length === item.objective.vars.length;
            if((item.binaries !== undefined) && (item.generals === undefined)) return item.binaries.length === item.objective.vars.length;
            if((item.binaries !== undefined) && (item.generals !== undefined)) return (item.binaries.length+item.generals.length) === item.objective.vars.length;
          } else {
            if((item.binaries === undefined) && (item.generals === undefined)) return true;
            if((item.binaries === undefined) && (item.generals !== undefined)) return item.generals.length < item.objective.vars.length;
            if((item.binaries !== undefined) && (item.generals === undefined)) return item.binaries.length < item.objective.vars.length;
            if((item.binaries !== undefined) && (item.generals !== undefined)) return (item.binaries.length+item.generals.length) < item.objective.vars.length;
          }
        } else return true; // qui se continuous non è stato settato, non faccio alcun filtro.
        }
      );
      res.send(modelsF);
    }
    catch(e){
      res.send(404);
    }
};


}
export default ModelController;