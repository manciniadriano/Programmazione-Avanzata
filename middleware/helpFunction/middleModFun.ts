/**
 * Verifica se la direction è corretta sia la presenza che per il tipo che per il valore
 * @param field è la direction del modello all'interno di objective
 * @returns true o false in base alla correttezza della direction
 */
const checkDirection = (field): boolean => {
  // nota: direction 1 è problema di minimo, 2 di massimo.
  if (field && typeof Number.isInteger(field) && (field === 1 || field === 2)) { // verifichiamo che la direzione esista, sia un intero e che sia 1 o 2.
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

    /**
     type of auxiliary/structural variable:
    readonly GLP_FR: number;   free (unbounded) variable 
    readonly GLP_LO: number;   variable with lower bound 
    readonly GLP_UP: number;   variable with upper bound 
    readonly GLP_DB: number;   double-bounded variable 
    readonly GLP_FX: number;   fixed variable 
     */
    let c: number = object.type;
    switch (c) {
      case 1: {
        return true; // unbounded: nessun controllo necessario.
      }
      case 2: { // lower bound, verifichiamo che sia scritto correttamente (lower bound >= upper bound).
        if (
          object.lb >= object.ub &&
          (object.ub === null || object.ub === 0 || object.ub === undefined)
        ) {
          return true;
        } else return false;
      }
      case 3: { // upper bound, verifichiamo che sia scritto correttamente (upper bound >= lower bound).
        if (
          object.ub >= object.lb &&
          (object.lb === null || object.lb === 0 || object.lb === undefined)
        ) {
          return true;
        } else return false;
      }
      case 4: { // double bounded, vogliamo solo che lb sia < di ub.
        if (object.lb < object.ub) {
          return true;
        } else return false;
      }
      case 5: { // variabile fissata, devono coincidere i 2 bound.
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
    for (const item of subjectTo) { // per ogni elemento dell'array dei vincoli verifichiamo che sia ok
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
      if (checkName(item.name) && checkUbLb(item)) { // sui bounds opzionali mi basta fare una verifica sul nome e sui upper/lower bounds inseriti
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
 * @param binaries l'array binaries/generals del modello
 * @param vars l'oggetto vars della funzione obiettivo
 * @returns true o false a seconda se l'oggetto è scritto correttamente
 */
export const checkBinariesGenerals = (
  binaries: Array<String>,
  vars: any
): boolean => {
  if (binaries != undefined) {
    let check: boolean[] = binaries.map((item) => {
      let c = vars.some((i) => i.name.includes(item)); // Il metodo some() verifica se almeno un elemento nell'array supera il test implementato dalla funzione
                                                       // in questo caso il metodo è che le variabili contengano l'elemento del binary/general corrente.
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
      if (generals.includes(item)) { // verifico che generals non contenga elementi che siano già dentro binaries
        return false;
      } else {
        return true;
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
 * questo metodo filtra il modello, togliendo gli elementi nel db non necessari per la visualizzazione del modello.
 * @param json 
 * @returns il modello filtrato
 */
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
  var t = s.replace(/"namemodel"/g, '"name"'); // rinomino namemodel (voce nel db) in name, per la visualizzazione
  var z = t.replace(/"subjectto"/g, '"subjectTo"');

  let modelFiltered = JSON.parse(z);
  Object.keys(modelFiltered).forEach((key) => { // filtro tutte le chiavi nulle, non essendo necessarie
    if (modelFiltered[key] === null) {
      delete modelFiltered[key];
    }
  });

  return modelFiltered;
};

/**
 * verifico che il numvars/numsub che setto nel filtro dei modelli sia scritto correttamente
 * @param numvars numero di variabili che vogliamo
 * @returns l'esito del controllo
 */
export const checkNum = (numvars: any): boolean => {
  if (numvars != undefined) {
    if (numvars && typeof numvars === "number") { // voglio che numvars e/o numsub sia un numero e che sia >0, se specificato
      return numvars > 0
    }
    else return false;
  } else return true;
};

/**
 * qui verifico che il filtro sia inserito o meno, se sia inserito come numero, e che sia 0 o 1.
 * @param filter continuous,binaries,generals, settati a 0 o 1 se li voglio o meno
 * @returns l'esito del filtro
 */
export const check3Filter = (filter: any): boolean => {
  if (filter != undefined) {
    if (typeof filter === "number") {
      return (filter === 0 || filter === 1)
    }
    else return false;
  } else return true;
};
