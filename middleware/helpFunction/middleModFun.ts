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
        return false;
      }
    } else {
      return false;
    }
  }
  return true;
};

const checkUbLb = (object) => {
  let c: number = object.type;
  switch (c) {
    case 2: {
      if (object.ub > object.lb || (object.up != 0 && object.up != null)) {
        return false;
      } else return true;
    }
    case 3: {
      if (object.lb > object.ub || (object.lb != 0 && object.lb != null)) {
        return false;
      } else return true;
    }
    case 4: {
      if (object.lb > object.ub) {
        return false;
      } else return true;
    }
    case 5: {
      if (object.lb != object.ub) {
        return false;
      } else return true;
    }
    default: {
      return false;
    }
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
 *  Summary: Verify that 'name' is well formatted
 *  Parameters: 'name' of req.body
 *  Return: Boolean indicating if is well formatted
 */
export const checkName = (field: string) => {
  if (field && typeof field === "string") {
    return true;
  } else {
    return false;
  }
};

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
 *  Summary: Verify that 'subjectTo' is well formatted
 *  Parameters: Body of request
 *  Return: Boolean indicating if is well formatted
 */
export const checkSubjectTo = (object: any) => {
  for (const item of object) {
    if (checkName(item.name) && checkVars(item.vars) && checkUbLb(item.bnds)) {
    } else {
      console.log("subjectTo, hai sbagliato upper o lower");
      return false;
    }
  }
  return true;
};

/*
 *  Summary: Verify that 'bounds' is well formatted
 *  Parameters: Body of request
 *  Return: Boolean indicating if is well formatted
 */
export const checkBounds = (object) => {
  if (object != undefined) {
    for (const item of object) {
      if (
        typeof item.name === "string" &&
        Number.isInteger(item.type) &&
        typeof item.ub === "number" &&
        item.lb === "number"
      ) {
        if (checkName(item.name) && checkUbLb(item)) {
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
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
/*export const checkBinaries = (binaries, vars) => {
  for(const item in binaries) {
    notInGenerals()
  }
};

const notInGenerals = (binaries: string, generals: Array<string>): boolean => {
  let array: Array<string> = generals.filter((item) => item == binaries);
  if (array.length > 0) {
    return false;
  } else {
    return true;
  }
}
*/
