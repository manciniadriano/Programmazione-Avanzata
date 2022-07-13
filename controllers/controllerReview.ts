import * as user from "../model/User";
import * as auth from "../middleware/middleAuth";
import * as model from "../model/Model";

export class ReviewController {

    public filtraJSON = (json: any) => {
        let stringModel: string = JSON.stringify(json);
        let modelnew = JSON.parse(stringModel);
    
        delete modelnew["id"];
        delete modelnew["cost"];
        delete modelnew["versione"];
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

    public newReview = async (req, res) => {
        try {
          let modelCheck: any = await model.checkExistingModel(req.body.name);
          if (modelCheck) {
            let version = modelCheck.versione;
            let totalCost: number =
              (auth.costContraint(req.body) + auth.checkBinOrInt(req.body)) * 0.5;
            await model.insertReview(req.body, version + 1, totalCost);
            let oldBudget: any = await user.getBudget(req.user.email);
            let newBudget = oldBudget.budget - totalCost;
            await user.budgetUpdate(newBudget, req.user.email);
            res.sendStatus(201);
          } else {
            res.sendStatus(404);
          }
        } catch (e) {
          res.sendStatus(404);
        }
      };

    public filterReviewByDate = async (req, res) => {
        try {
          if (
            typeof req.body.date === "string" &&
            typeof req.body.name === "string"
          ) {
            let models: any = await model.filterByDate(
              req.body.name,
              req.body.date
            );
    
            let modelsF: any = models.map((item) => this.filtraJSON(item));
    
            res.status(200).json(modelsF);
          } else {
            console.log("non stai dando dati corretti");
            res.sendStatus(400);
          }
        } catch (e) {
          res.sendStatus(404);
        }
      };
    
      /**
       * struttura json esempio: {"name": "namemodel", "number":3} number sarebbe il numero di variabili
       * @param req
       * @param res
       */
      public filterByNumVars = async (req, res) => {
        try {
          if (
            typeof req.body.name === "string" &&
            typeof req.body.number === "number"
          ) {
            let models: any = await model.getReviewOfModel(req.body.name);
            let modelsF: any = models
              .map((item) => this.filtraJSON(item))
              .filter((item) => item.objective.vars.length === req.body.number);
    
            res.send(modelsF);
          } else {
            console.log("non stai dando dati corretti");
            res.sendStatus(400);
          }
        } catch (e) {
          res.sendStatus(404);
        }
      };

    public deleteReview = async (req, res) => {
        try {
          if (req.body.version > 1) {
            await model.deleteModel(req.body.name, req.body.version);
            res.sendStatus(200);
          } else res.sendStatus(400);
        } catch (e) {
          res.sendStatus(404);
        }
      };
    
      public getDeletedReview = async (req, res) => {
        try {
          let models: any = await model.getDeletedReview();
          let modelsF: any = models.map((item) => this.filtraJSON(item));
          res.send(modelsF);
        } catch {
          res.sendStatus(404);
        }
      };
    
      public restoreReview = async (req, res) => {
        try {
          if (req.body.version > 1) {
            await model.restoreReview(req.body.name, req.body.version);
            res.sendStatus(200);
          } else res.sendStatus(400);
        } catch (e) {
          res.sendStatus(404);
        }
      };


}