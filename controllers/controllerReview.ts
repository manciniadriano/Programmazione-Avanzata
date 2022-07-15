import * as user from "../model/User";
import * as auth from "../middleware/middleAuth";
import * as model from "../model/Model";

export class ReviewController {
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

  public newReview = async (req, res) => {
    try {
      let modelCheck: any = await model.checkExistingModel(req.body.name);
      if (modelCheck) {
        let version = modelCheck.version;
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

  public filterReview = async (req, res) => {
    try {
      let reviews: any = await model.getReviewOfModel(req.body.name);
      let filteredReview = reviews
        .filter((item) => {
          if (req.body.date) {
            return req.body.date === item.creation_date;
          } else {
            return true;
          }
        })
        .filter((item) => {
          if (req.body.numvars) {
            return req.body.numvars === item.objective.vars.length;
          } else {
            return true;
          }
        })
        .map((item) => this.filtraJSON(item));
      res.send(filteredReview);
    } catch {
      res.sendStatus(400);
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
