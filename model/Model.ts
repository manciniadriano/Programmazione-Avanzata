import { DataTypes, IntegerDataType, Model, Sequelize } from "sequelize";
import { SingletonDB } from "../model/Database";
import {Options} from "./Options"
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
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    generals: {
      type: DataTypes.ARRAY(DataTypes.STRING),
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
        cb: {
          call: (progress) => console.log(progress),
          each: 1,
        },
      }
    },
    versione: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cost: {
      type: DataTypes.NUMBER,
      allowNull: true,
    }
  },
  {
    modelName: "models",
    timestamps: false,
  }
);

export async function insertModel(object: any, cost: number) {
  //const options= new Options()
  const model = await ModelOpt.create({
    namemodel: object.name,
    objective: object.objective,
    subjectto: object.subjectTo,
    bounds: object.bounds,
    binaries: object.binaries,
    generals: object.generals,
    options: object.options,
    versione: 1,
    cost:cost
  });
  return model;
}

export async function checkExistingModel(name: string, version: number) {
  if (version) {
    var model = await ModelOpt.findOne({
      where: { namemodel: `${name}`, versione: version },
    });
  } else {
    const lastVersion: number = await ModelOpt.max('versione', { where: { namemodel : name } })
    var model = await ModelOpt.findOne({
      where: { namemodel: name, versione: lastVersion },
    });
  }
  return model;
}
