/**
 * Verifica se la direction è corretta sia la presenza che per il tipo che per il valore
 * @param field è la direction del modello all'interno di objective
 * @returns true o false in base alla correttezza della direction
 */
const checkDirection = (field): boolean => {
  if (field && typeof Number.isInteger(field) && (field === 1 || field === 2)) {
    return true;
  } else {
    return false;
  }
};

/**
 * Verifica che dentro vars siano rispettivamente stringa e numero
 * @param objectField è un oggetto di tipovars: {"name": string , "coef": number}[]
 * @returns true o false a seconda se l'oggetto è scritto correttamente
 */
const checkVars = (objectField): boolean => {
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

/**
 * Funzione che verifica se i vincoli del modello sono corretti
 * @param object oggetto bnds degli oggetti di subjectTo
 * @returns vero o falso a seconda se i vincoli sono settati nel modo corretto
 */
const checkUbLb = (object): boolean => {
  if (
    Number.isInteger(object.type) &&
    typeof object.ub === "number" &&
    typeof object.lb === "number"
  ) {
    let c: number = object.type;
    switch (c) {
      case 1: {
        return true;
      }
      case 2: {
        if (
          object.lb >= object.ub &&
          (object.ub === null || object.ub === 0 || object.ub === undefined)
        ) {
          return true;
        } else return false;
      }
      case 3: {
        if (
          object.ub >= object.lb &&
          (object.lb === null || object.lb === 0 || object.lb === undefined)
        ) {
          return true;
        } else return false;
      }
      case 4: {
        if (object.lb < object.ub) {
          return true;
        } else return false;
      }
      case 5: {
        if (object.lb === object.ub) {
          return true;
        } else return false;
      }
      default: {
        return false;
      }
    }
  } else {
    return false;
  }
};

/**
 * Verifica che il name sia una stringa e sia presente
 * @param name "name" degli oggetti del modello
 * @returns true o false se scritto in modo corretto o meno
 */
export const checkName = (name: string): boolean => {
  if (name != undefined) {
    if (name && typeof name === "string") {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

/**
 * Verifica che l'"objective" del modello sia nella giusta forma verificando Name, Direction, Vars
 * @param objective è l'oggetto objective del modello
 * @returns true o false a seconda se scritto in modo corretto o meno
 */
export const checkObjective = (objective: any): boolean => {
  if (objective != undefined) {
    if (
      checkName(objective.name) &&
      checkDirection(objective.direction) &&
      checkVars(objective.vars)
    ) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

/**
 * Verifica che "subjectTo" sia scritto correttamente verificando name, vars, bnds
 * @param subjectTo è la subjectTo del modello
 * @returns true o false a seconda se scritto correttamente
 */
export const checkSubjectTo = (subjectTo: any): boolean => {
  if (subjectTo != undefined) {
    for (const item of subjectTo) {
      if (
        checkName(item.name) &&
        checkVars(item.vars) &&
        checkUbLb(item.bnds)
      ) {
      } else {
        return false;
      }
    }
    return true;
  } else {
    return false;
  }
};

/**
 * Verifica che il campo opzionale bounds sia scritto correttamente
 * @param object oggetto bounds
 * @returns true o false se scritto correttamente o meno
 */
export const checkBounds = (bounds: any): boolean => {
  if (bounds != undefined) {
    for (const item of bounds) {
      if (checkName(item.name) && checkUbLb(item)) {
      } else {
        return false;
      }
    }
    return true;
  } else {
    return true;
  }
};

/**
 * Verifica se binaries/generals è un'array di sole stringhe, verifica anche che la variabile sia presente nella funziona obiettivo
 * @param binaries l'array binaries del modello
 * @param vars l'oggetto vars della funzione obiettivo
 * @returns true o false a seconda se l'oggetto è scritto correttamente
 */
export const checkBinariesGenerals = (
  binaries: Array<String>,
  vars: any
): boolean => {
  if (binaries != undefined) {
    let check: boolean[] = binaries.map((item) => {
      let c = vars.some((i) => i.name.includes(item));
      if (typeof item === "string" && c) {
        return true;
      } else {
        return false;
      }
    });
    if (check.includes(false)) {
      return false;
    } else {
      return true;
    }
  } else {
    return true;
  }
};

/**
 * Verifica che non vengano dichiarate contemporaneamente variabili binarie e generals
 * @param binaries binaries del modello
 * @param generals generals del modello
 * @returns true se non si sovrappongono binaries e generals
 */
export const checkBinGenOverlap = (
  binaries: Array<String>,
  generals: Array<String>
): boolean => {
  if (binaries != undefined && generals != undefined) {
    let check: boolean[] = binaries.map((item) => {
      if (generals.includes(item)) {
        return false;
      } else {
        return true;
      }
    });
    console.log(check);
    if (check.includes(false)) {
      return false;
    } else {
      return true;
    }
  } else {
    return true;
  }
};

export const filtraJSON = (json: any) => {
  let stringModel: string = JSON.stringify(json);
  let modelnew = JSON.parse(stringModel);

  delete modelnew["id"];
  delete modelnew["cost"];
  delete modelnew["version"];
  delete modelnew["creation_date"];
  delete modelnew["options"];
  delete modelnew["valid"];

  let s = JSON.stringify(modelnew);
  var t = s.replace(/"namemodel"/g, '"name"');
  var z = t.replace(/"subjectto"/g, '"subjectTo"');

  let modelFiltered = JSON.parse(z);
  Object.keys(modelFiltered).forEach((key) => {
    if (modelFiltered[key] === null) {
      delete modelFiltered[key];
    }
  });

  return modelFiltered;
};