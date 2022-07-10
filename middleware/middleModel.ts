import * as middleF from "./validators/modelValidator";

export async function newModelValidation(req: any, res: any, next: any) {
  try {
    let response = await middleF.validationModel(req.body);
    console.log(response);
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
