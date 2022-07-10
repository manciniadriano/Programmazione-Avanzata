import * as middleF from "./validators/modelValidator";
import * as jwt from "jsonwebtoken";

export async function newModelValidation(req: any, res: any, next: any) {
  try {
    let response = await middleF.validationModel(req.body);
    if (response) {
      console.log("Richiesta ben formata");
      next();
    } else {
      res.sendStatus(400); //Bad Request
    }
  } catch (error) {
    console.log("errore");
    res.sendStatus(403);
  }
}

