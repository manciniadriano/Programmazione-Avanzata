import { DataTypes, Op, IntegerDataType, Model, Sequelize } from "sequelize";
import { SingletonDB } from "../model/Database";
import { OptionsBuilder } from "./OptionsBuilder";
const GLPK = require("glpk.js");
const glpk = GLPK();
const sequelize = SingletonDB.getInstance().getConnection();

const ModelOpt = sequelize.define(
  "models",
  {
    namemodel: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    objective: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    subjectto: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    bounds: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    binaries: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    generals: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    options: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {
        mipgap: 0.0,
        tmlim: Number.MAX_VALUE,
        msglev: glpk.GLP_MSG_ERR,
        presol: true,
        //  cb: {
        //    call: (progress) => console.log(progress),
        //   each: 1,
        //},
      },
    },
    version: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cost: {
      type: DataTypes.NUMBER,
      allowNull: true,
    },
    creation_date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    valid: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
    },
  },
  {
    modelName: "models",
    timestamps: false,
  }
);

export async function insertModel(object: any, cost: number) {
  var search = await ModelOpt.findOne({
    where: { namemodel: `${object.name}` },
  });

  if (!search) {
    if (object.options) {
      var options = new OptionsBuilder()
        .setmipgap(object.options.mipgap)
        .settmlim(object.options.tmlim)
        .setmsglev(object.options.msglev)
        .setpresol(object.options.presol);
      //.setcb(object.options.cb);
    } else {
      var options = new OptionsBuilder();
    }
    //let date = new Date().toLocaleString();
    let date = new Date().toLocaleDateString();
    const model = await ModelOpt.create({
      namemodel: object.name,
      objective: object.objective,
      subjectto: object.subjectTo,
      bounds: object.bounds,
      binaries: object.binaries,
      generals: object.generals,
      options: options,
      version: 1,
      cost: cost,
      creation_date: date,
    });
    return model;
  } else {
    return false;
  }
}

export async function checkExistingModel(name: string, version?: number) {
  if (version) {
    var model = await ModelOpt.findOne({
      where: { namemodel: `${name}`, version: version },
    });
  } else {
    const lastVersion: number = await ModelOpt.max("version", {
      where: { namemodel: name },
    });
    var model = await ModelOpt.findOne({
      where: { namemodel: name, version: lastVersion },
    });
  }
  return model;
}

export async function insertReview(object: any, version: number, cost: number) {
  if (object.options) {
    var options = new OptionsBuilder()
      .setmipgap(object.options.mipgap)
      .settmlim(object.options.tmlim)
      .setmsglev(object.options.msglev)
      .setpresol(object.options.presol);
    //.setcb(object.options.cb);
  } else {
    var options = new OptionsBuilder();
  }
  let date = new Date().toLocaleDateString();
  const model = await ModelOpt.create({
    namemodel: object.name,
    objective: object.objective,
    subjectto: object.subjectTo,
    bounds: object.bounds,
    binaries: object.binaries,
    generals: object.generals,
    options: options,
    version: version,
    cost: cost,
    creation_date: date,
  });
  return model;
}

/*export async function filterByDate(name: string, date: string) {
  const models = await ModelOpt.findAll({
    where: {
      namemodel: name,
      creation_date: date,
      versione: { [Op.gt]: 1 },
      valid: { [Op.eq]: true },
    },
  });
  return models;
}*/

export async function getReviewOfModel(name: string) {
  const models = await ModelOpt.findAll({
    where: {
      namemodel: name,
      version: { [Op.gt]: 1 },
      valid: { [Op.eq]: true },
    },
  });
  return models;
}

export async function getModels() {
  const models = await ModelOpt.findAll({
    where: { version: { [Op.eq]: 1 } },
  });
  return models;
}

export async function deleteModel(name: string, version: number) {
  const models = await ModelOpt.update(
    { valid: false },
    { where: { namemodel: name, version: version, valid: { [Op.eq]: true } } }
  );
  return models;
}

export async function getDeletedReview() {
  const models = await ModelOpt.findAll({
    where: { valid: { [Op.eq]: false } },
  });
  return models;
}

export async function restoreReview(name: string, version: number) {
  const models = await ModelOpt.update(
    { valid: true },
    { where: { namemodel: name, version: version, valid: { [Op.eq]: false } } }
  );
  return models;
}
