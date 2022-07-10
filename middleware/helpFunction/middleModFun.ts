import { type } from "os";

const checkDirection = (field) => {
  if (field && typeof Number.isInteger(field) && (field === 1 || field === 2)) {
    return true;
  } else {
    return false;
  }
};

const checkVars = (objectField) => {
  for (const item of objectField) {
    if (item.name && typeof item.name === "string") {
      if (item.coef && typeof item.coef === "number") {
      } else {
        console.log("Not valid coef variable");
        return false;
      }
    } else {
      console.log("Not valid name variable");
      return false;
    }
  }
  return true;
};

const checkUbLp = (object) => {
  if (
    (object.ub || object.ub == 0) &&
    typeof object.ub === "number" &&
    (object.lb || object.lb == 0) &&
    typeof object.lb === "number"
  ) {
    return true;
  } else {
    return false;
  }
};

const searchVar = (item, body) => {
  for (const elem of body) {
    if (elem.name === item) {
      return true;
    }
  }
  return false;
};

/*
 *  Summary: Verify that req is JSON
 *  Parameters: Body of request
 *  Return: Boolean indicating success or not
 */
export const isJsonString = (obj: any) => {
  console.log(obj)
  try {
    let a = JSON.stringify(obj);
    console.log(a)
    JSON.parse(a);
  } catch (e) {
    console.log('Not valid')
    return false;
  }
  return true;
};

/*
 *  Summary: Verify that 'name' is well formatted
 *  Parameters: 'name' of req.body
 *  Return: Boolean indicating if is well formatted
 */
export const checkName = (field: string) => {
  if (field && typeof field === "string") {
    return true;
  } else {
    console.log("checkName");
    return false;
  }
};

/*
 *  Summary: Verify that 'bnds' is well formatted
 *  Parameters: Body of request
 *  Return: Boolean indicating if is well formatted
 */
export const checkBnds = (object) => {
  if (object) {
    if (typeof object === "object") {
      if (
        object.type &&
        Number.isInteger(object.type) &&
        object.type > 0 &&
        object.type < 6
      ) {
        if (typeof object.ub === "number" && typeof object.lb === "number") {
          return true;
        } else {
          console.log("Ub or Lb not a number");
          return false;
        }
      } else {
        console.log("Wrong type");
        return false;
      }
    } else {
      console.log("Is not a object");
      return false;
    }
  } else {
    console.log("There isn't bnds");
    return false;
  }
};

/*
 *  Summary: Verify that 'subjectTo' is well formatted
 *  Parameters: Body of request
 *  Return: Boolean indicating if is well formatted
 */
export const checkSubjectTo = (object: any) => {
  for (const item of object) {
    if (checkName(item.name) && checkVars(item.vars) && checkBnds(item.bnds)) {
    } else {
      console.log("subjectTo");
      return false;
    }
  }
  return true;
};

/*
 *  Summary: Verify that 'objective' is well formatted
 *  Parameters: Body of request
 *  Return: Boolean indicating if is well formatted
 */
export const checkObjective = (object) => {
  if (
    checkName(object.name) &&
    checkDirection(object.direction) &&
    checkVars(object.vars)
  ) {
    return true;
  } else {
    console.log("objective");
    return false;
  }
};

/*
 *  Summary: Verify that 'bounds' is well formatted
 *  Parameters: Body of request
 *  Return: Boolean indicating if is well formatted
 */
export const checkBounds = (object) => {
  if (
    checkName(object.name) &&
    checkDirection(object.type) &&
    checkUbLp(object)
  ) {
    return true;
  } else {
    return false;
  }
};

/*
 *  Summary: Verify that 'binaries' is well formatted
 *  Parameters: Body of request
 *  Return: Boolean indicating if is well formatted
 */
export const checkBinaries = (binaries, vars) => {
  if (binaries && binaries.lenght) {
    for (const item of binaries) {
      if (typeof item === "string" && searchVar(item, vars)) {
      } else {
        return false;
      }
    }
  } else {
    return false;
  }
  return true;
};
