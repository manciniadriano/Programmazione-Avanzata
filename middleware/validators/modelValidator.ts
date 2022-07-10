import * as mf from "../helpFunction/middleModFun";

export const validationModel = (body: any): boolean => {
  if (
    mf.isJsonString(body) &&
    mf.checkName(body.name) &&
    mf.checkObjective(body.objective) &&
    mf.checkSubjectTo(body.subjectTo)
  ) {
    return true;
  } else {
    return false;
  }
};
