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
  var search = await ModelOpt.findOne({ // prima vediamo se c'è già un modello con quel nome
    where: { namemodel: `${object.name}` },
  });

  if (!search) {
    if (object.options) {
      var options = new OptionsBuilder() // se il parametro Options (opzionale) viene specificato nel modello allora si instanzia la classe
                                         // abbiamo utilizzato un builder per realizzare i set a seconda di cosa è stato specificato 
                                         // essendo a sua volta Options costituito da parametri opzionali
                                         // se non sono specificati, si settano valori di default
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
    const model = await ModelOpt.create({ // qui si crea e si inserisce nel db, popolando sulla base di object che ha tutto ciò che serve,
                                          // a cui si aggiungerà l'id (in automatico), le options, la versione (1 per costruzione),
                                          // il costo e la data di creazione, come stringa.
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
  if (version) { // se version è specificato allora si cerca anche in base ad esso, altrimenti si restituisce l'ultimo (tramite la max)
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
    version: version, //qui version non può essere 1, sarà passato tramite parametro
    cost: cost,
    creation_date: date,
  });
  return model;
}

export async function getReviewOfModel(name: string) {
  const models = await ModelOpt.findAll({
    where: {
      namemodel: name,
      version: { [Op.gt]: 1 }, // Operator greater, per tornare solo le revisioni (versione >1)
      valid: { [Op.eq]: true }, // operator equal, per tornare solo i validi (non logicamente cancellati)
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

export async function getSpecificModel(name: string, version: number) {
  const model = await ModelOpt.findOne({
    where: {
      namemodel: name,
      version: { [Op.eq]: version },
      valid: { [Op.eq]: true },
    },
  });
  return model;
}

export async function deleteModel(name: string, version: number) {
  await ModelOpt.update(
    { valid: false },
    { where: { namemodel: name, version: version, valid: { [Op.eq]: true } } } // cerchiamo il modello attualmente valido
  );
}

export async function getDeletedReview() { // funzione per elencare tutte le revisioni cancellate, come da specifica
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
