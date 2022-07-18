import * as mf from "./helpFunction/middleModFun";
import { LP } from "glpk.js";

// esempio di richiesta di modello
/*{
  "name": "mip",
  "objective": {
    "direction": 2,
    "name": "obj",
    "vars": [
      {
        "name": "x1",
        "coef": 1
      },
      {
        "name": "x2",
        "coef": 2
      },
      {
        "name": "x3",
        "coef": 3
      },
      {
        "name": "x4",
        "coef": 1
      }
    ]
  },
  "subjectTo": [
    {
      "name": "c1",
      "vars": [
        {
          "name": "x1",
          "coef": -1
        },
        {
          "name": "x2",
          "coef": 1
        },
        {
          "name": "x3",
          "coef": 1
        },
        {
          "name": "x4",
          "coef": 10
        }
      ],
      "bnds": {
        "type": 3,
        "ub": 20,
        "lb": 0
      }
    },
    {
      "name": "c2",
      "vars": [
        {
          "name": "x1",
          "coef": 1
        },
        {
          "name": "x2",
          "coef": -3
        },
        {
          "name": "x3",
          "coef": 1
        }
      ],
      "bnds": {
        "type": 3,
        "ub": 30,
        "lb": 0
      }
    },
    {
      "name": "c3",
      "vars": [
        {
          "name": "x2",
          "coef": 1
        },
        {
          "name": "x4",
          "coef": -3.5
        }
      ],
      "bnds": {
        "type": 5,
        "ub": 0,
        "lb": 0
      }
    }
  ],
  "bounds": [
    {
      "name": "x1",
      "type": 4,
      "ub": 40,
      "lb": 0
    },
    {
      "name": "x4",
      "type": 4,
      "ub": 3,
      "lb": 2
    }
  ],
  "generals": [
    "x4"
  ]
}*/

/**
 * Middleware per validare la richiesta, con opportuni messaggi di errore
 * @param req request
 * @param res response
 * @param next
 */
export async function newModelValidation(req: any, res: any, next: any) {
  try {
    let response = await validationModel(req.body); // qui vediamo l'esito della validazione del modello
    if (response) {
      
      next();
    } else {
      res.sendStatus(400); //Bad Request
    }
  } catch (error) {
    res.sendStatus(403);
  }
}

/**
 * Funzione per validare la richiesta della creazione del nuovo modello
 * con opportuni controlli sui diversi campi
 * @param model modello della richiesta
 * @returns true o false se il modello è scritto correttamente
 */
const validationModel = (model: any): boolean => {
  if (
    mf.checkName(model.name) &&
    mf.checkObjective(model.objective) &&
    mf.checkSubjectTo(model.subjectTo) &&
    mf.checkBounds(model.bounds) &&
    mf.checkBinariesGenerals(model.binaries, model.objective.vars) &&
    mf.checkBinariesGenerals(model.generals, model.objective.vars) &&
    mf.checkBinGenOverlap(model.binaries, model.generals)
  ) {
    return true;
  } else {
    return false;
  }
};

/**
 * Middleware per la richiesta di filtro dei model
 * @param req request
 * @param res response
 * @param next 
 * {
    "numvars": 2, numero di variabili 
    "numsub":3, numero di vincoli
    "continuous": 1, ci sono variabili continue, valore binario. se non lo specifico non filtro su di esso.
    "generals": 1, se metto 0 filtro su quelli che non hanno vars continue
    "binaries": 0
}
 */

export async function newFilterValidation(req: any, res: any, next: any) {
  try {
    let response = await filterModels(req.body);
    if (response) {
      next();
    } else {
      res.sendStatus(400);
    }
  } catch (error) {
    res.sendStatus(403);
  }
}

/**
 * Funzione per validare la richiesta di filtro
 * con opportuni controlli sui diversi campi
 * @param req richiesta di filtro
 * @returns true o false se il filtro è scritto correttamente
 */
export const filterModels = (req: any): boolean => {
  if (
    mf.checkNum(req.numvars) &&
    mf.checkNum(req.numsub) &&
    mf.check3Filter(req.continuous) &&
    mf.check3Filter(req.binaries) &&
    mf.check3Filter(req.generals)
  ) {
    return true;
  } else {
    return false;
  }
}