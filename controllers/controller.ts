import { Model } from "../model/model";
import { ModelBuilder } from "../model/model-builder";
import { SingletonDB } from "../model/Database";
import * as mauth from "../middleware/middleAuth";
import * as sql from "sequelize";
import { GLPK } from "glpk.js";
class ModelController {
  public takeJson = (req, res) => {
    console.log("Response code: " + res.statusCode);

    const object = req.body;
    const model: Model = new ModelBuilder(
      object.name,
      object.objective,
      object.subjectTo
    )
      .setBounds(object.bounds)
      .setBinaries(object.binaries)
      .setGenerals(object.generals)
      .setOptions(object.options)
      .build();
  };

  public newModel = async (req, res) => {
    try {
      const connection = SingletonDB.getInstance().getConnection();
      let object = req.body;
      let totalCost: number =
        mauth.costContraint(object) + mauth.checkBinOrInt(object);
      const [budget]: any = await connection.query(
        `SELECT "budget" FROM "users" WHERE "email" = '${req.user.email}';`,
        {
          type: sql.QueryTypes.SELECT,
        }
      );
      console.log("budget: " + budget.budget);
      const newBudget = budget.budget - totalCost;
      console.log("new budget: " + newBudget);
      console.log("email: " + req.user.email);
      await connection.query(
        `UPDATE "users" SET "budget" = ${newBudget} WHERE "email" = '${req.user.email}';`,
        {
          type: sql.QueryTypes.UPDATE,
        }
      );

      const model = JSON.parse(req.body);
      console.log(model.name);
      console.log(String(model.objective));
      console.log(String(model.subjectTo));
      await connection.query(
        `INSERT INTO model(namemodel, objective, subjectTo, bounds, binaries, generals, options) VALUES
        (${model.name}, ${String(model.objective)}, ${String(model.subjectTo)});`
      )
    } catch (e) {
      console.log("errore in fase di inserimento");
    }
  };
}

export default ModelController;