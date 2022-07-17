import * as user from "../model/User";
import * as auth from "../middleware/middleAuth";
import * as model from "../model/Model";
import { filtraJSON } from "../middleware/helpFunction/middleModFun";

export class ReviewController {

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
        .map((item) => filtraJSON(item));
      res.send(filteredReview);
    } catch {
      res.sendStatus(400);
    }
  };

  public deleteReview = async (req, res) => {
    try {
      if (await model.getSpecificModel(req.body.name, req.body.version)) {
        await model.deleteModel(req.body.name, req.body.version)
        res.sendStatus(200);
      }
      else {
        throw "Not Found";
      }
    } catch (e) {
      res.sendStatus(404);
    }
  };

  public getDeletedReview = async (req, res) => {
    try {
      let models: any = await model.getDeletedReview();
      let modelsF: any = models.map((item) => filtraJSON(item));
      res.send(modelsF);
    } catch {
      res.sendStatus(404);
    }
  };

  public restoreReview = async (req, res) => {
    try {
      if (await model.getSpecificModel(req.body.name, req.body.version)) {
        await model.restoreReview(req.body.name, req.body.version)
        res.sendStatus(200);
      }
      else {
        throw "Not Found";
      }
    } catch (e) {
      res.sendStatus(404);
    }
  };
}
