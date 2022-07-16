/*
{
    "name":"name",
    "date":"7/15/2022",
    "numvars":2
}

*/

/**
 * Middleware per verificare che il filtro per le review sia corretto,
 * con possibilità di scegliere con quali parametri filtrare
 * @param req request
 * @param res response
 * @param next
 */
export const middleFilterReview = (req: any, res: any, next: any) => {
  if (req.body.name != undefined && typeof req.body.name === "string") {
    if (
      req.body.date == undefined ||
      (req.body.date != undefined && typeof req.body.date === "string")
    ) {
    } else {
      res.sendStatus(400);
    }
    if (
      req.body.numvars == undefined ||
      (req.body.numvars != undefined && typeof req.body.numvars === "number")
    ) {
    } else {
      res.sendStatus(400);
    }
    next();
  } else {
    res.sendStatus(400);
  }
};

/*
{
    "name":"mip_with_binaries",
    "version":2
}
*/

/**
 * Middleware per la rimozione di una review del modello
 * @param req request
 * @param res response
 * @param next
 */
export const middleDeleteReview = (req: any, res: any, next: any) => {
  if (
    req.body.name &&
    typeof req.body.name === "string" &&
    req.body.version &&
    Number.isInteger(req.body.version) &&
    req.body.version > 1
  ) {
    next();
  } else {
    res.sendStatus(400);
  }
};

/*
{
    "name":"mip_with_binaries",
    "version":2
}
*/

/**
 * Middleware per verificare che la richiesta di restore di una revisione sia valida
 * @param req request
 * @param res response
 * @param next 
 */
export const middleRestoreReview = (req: any, res: any, next: any) => {
    if (
      req.body.name &&
      typeof req.body.name === "string" &&
      req.body.version &&
      Number.isInteger(req.body.version) &&
      req.body.version > 1
    ) {
      next();
    } else {
      res.sendStatus(400);
    }
  };
