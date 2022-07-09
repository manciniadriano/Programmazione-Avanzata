const checkDirection = (field) => {
    if (field && typeof Number.isInteger(field) &&
    (field === 1 || field === 2)) {
        return true;
    } else {
        return false;
    }
}

const checkVars = (objectField) => {
    for (const item of objectField) {
        if (item.name && typeof item.name === 'string') {
            if (item.coef && typeof item.coef === 'number') {
            } else {
                console.log("Not valid coef variable");
                return false
            }
        } else {
            console.log("Not valid name variable");
            return false
        }
    }
    return true;
}

const checkUbLp = (object) => {
    if ((object.ub || object.ub == 0 ) && typeof object.ub === 'number' 
    && ((object.lb || object.lb == 0) && typeof object.lb === 'number')) {
    return true
    } else {
        return false;
    }
}

export const isJsonString = (obj: any) => {
    try {
        JSON.parse(obj);
        return true;
    } catch (e) {
        return false;
    }
};

export const checkName = (field) => {
    if (field && typeof field === 'string') {
        return true
    } else {
        return false
    }
}

export const checkBnds = (object) => {
    if (object) {
        if (typeof object === 'object') {
            if (object.type && Number.isInteger(object.type) && (object.type > 0 && object.type < 6)) {
                if (typeof object.ub === 'number' && typeof object.lb === 'number') {
                    return true
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
}

export const checkSubjectTo = (object) => {
    if (checkName(object.name) && checkVars(object.vars)
    && checkBnds(object.bnds)) {
        return true;
    } else {
        return false;
    }
} 

export const checkObjective = (object) => {
    if (checkName(object.name) && checkDirection(object.name)
    && checkVars(object.vars)) {
        return true;
    } else {
        return false;
    }
}

export const checkBounds = (object) => {
    if (checkName(object.name) && checkDirection(object.type)
    && checkUbLp(object)) {
        return true;
    } else {
        return false;
    }
}
