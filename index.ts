import { SingletonDB } from "./model/Database";
import * as express from 'express';

//import * as bodyParser from "bod"
//const express = require("express");
var app = express();
//const bodyParser = require("body-parser");
//const { LP, Options } = require('glpk.js');

//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));

const PORT = 8080;
const HOST = '0.0.0.0';

function isJsonString(str) {
    try {
        JSON.parse(str);
        return true;
    } catch (e) {
        return false;
    }
};

function checkVars(objectField, res) {
    let flag = true;
    for (const item of objectField) {
        if (item.name && typeof item.name === 'string') {
            if (item.coef && typeof item.coef === 'number') {
            } else {
                console.log("Not valid coef variable");
                res.sendStatus(403);
                flag = false;
            }
        } else {
            console.log("Not valid name variable");
            res.sendStatus(403);
            flag = false
        }
    }
    return flag
}

//Check per l'oggetto bounds interno a subjectTo
function checkBnds(object, res) {
    if (object) {
        if (typeof object === 'object') {
            if (object.type && Number.isInteger(object.type) && (object.type > 0 && object.type < 6)) {
                if (typeof object.ub === 'number' && typeof object.lb === 'number') {
                    return true
                } else {
                    console.log("Ub or Lb not a number");
                    res.sendStatus(403);
                    return false;
                }
            } else {
                console.log("Wrong type");
                res.sendStatus(403);
                return false;
            }
        } else {
            console.log("Is not a object");
            res.sendStatus(403);
            return false;
        }
    } else {
        console.log("There isn't bnds");
        res.sendStatus(403);
        return false;
    }
}

app.use('/newModel', (err, req, res, next) => {
    if (isJsonString(req.body)) {
        next();
    } else {
        console.log("Not valid JSON");
        res.sendStatus(403);
    }
})

app.use('/newModel', (req, res, next) => {
    let object = req.body;
    if (object.name) {
        if (typeof object.name === 'string') {
            next();
        } else {
            console.log("Name is not a string");
            res.sendStatus(403);
        }
    } else {
        console.log("Need name value");
        res.sendStatus(403);
    }
})

app.use('/newModel', (req, res, next) => {
    let object = req.body;
    if (object.name) {
        if (typeof object.name === 'string') {
            next();
        } else {
            console.log("Name is not a string");
            res.sendStatus(403);
        }
    } else {
        console.log("Need name value");
        res.sendStatus(403);
    }
})

app.use('/newModel', (req, res, next) => {
    let object = req.body;
    if (object.objective) {
        if (typeof object.objective === 'object') {
            if (object.objective.direction && (object.objective.direction === 1 || object.objective.direction === 2)) {
                next();
            } else {
                console.log("Direction in object not valid");
                res.sendStatus(403);
            }
        } else {
            console.log("Objective not valid");
            res.sendStatus(403);
        }
    } else {
        console.log("Need objective value");
        res.sendStatus(403);
    }
})

app.use('/newModel', (req, res, next) => {
    let object = req.body;
    if (object.objective.name) {
        if (typeof object.objective.name === 'string') {
            next();
        } else {
            console.log("Objective Name is not a string");
            res.sendStatus(403);
        }
    } else {
        console.log("Need objectvie name value");
        res.sendStatus(403);
    }
})

app.use('/newModel', (req, res, next) => {
    let object = req.body;
    if (object.objective.vars) {
        if (Array.isArray(object.objective.vars)) {
            if (object.objective.vars.length) {
                let flag = true;
                for (const item of object.objective.vars) {
                    if (item.name && typeof item.name === 'string') {
                        if (item.coef && typeof item.coef === 'number') {
                        } else {
                            console.log("Not valid coef variable");
                            res.sendStatus(403);
                            flag = false;
                        }
                    } else {
                        console.log("Not valid name variable");
                        res.sendStatus(403);
                        flag = false
                    }
                } if (flag) {
                    next();
                }
            } else {
                console.log("Empty Array");
                res.sendStatus(403);
            }
        } else {
            console.log("Var object is not an array");
            res.sendStatus(403);
        }
    } else {
        console.log("Vars Objective not valid");
        res.sendStatus(403);
    }
})

app.use('/newModel', (req, res, next) => {
    let object = req.body.subjectTo;
    if (object) {
        if (Array.isArray(object)) {
            if (object.length) {
                let flag = true;
                for (const item of object) {
                    if (item.name && typeof item.name === 'string') {
                        if (checkVars(item.vars, res)) {
                            if (checkBnds(item.bnds, res)) {
                            } else {
                                flag = false;
                            }
                        } else {
                            flag = false;
                            console.log("Vars of subjectTo not good");
                            res.sendStatus(403);
                        }
                    } else {
                        flag = false;
                        console.log("Name subjectTo not defined");
                        res.sendStatus(403);
                    }
                } if (flag) {
                    next();
                }
            } else {
                console.log("Empty Array");
                res.sendStatus(403);
            }
        } else {
            console.log("Var object is not an array");
            res.sendStatus(403);
        }
    } else {
        console.log("Vars Objective not valid");
        res.sendStatus(403);
    }
})

//Funzione per upper bound e lower buon con direction
/*app.use('/newModel', (req, res, next) => {
    let object = req.body;
    if (object.objective.direction === 2) {
        let flag = true;
        for (const item of object.subjectTo) {
            if (item.bnds.lb === 0 && item.bnds.ub >= item.bnds.lb) {
            } else {
                flag = false;
                res.sendStatus(403);
            }
        }
        if (flag) {
            next();
        }
    } else if (object.objective.direction === 1) {
        for (const item of object.subjectTo) {
            if (item.bnds.ub === 0 && item.bnds.lb >= item.bnds.ub) {
            } else {
                flag = false
                res.sendStatus(403);
            }
        }
        if (flag) {
            next();
        }
    } else {
        console.log("Direction ub lb don't coherent");
        res.sendStatus(403);
    }
})*/


//Controllo per Bounds? opzionale.

app.use('/newModel', (req, res, next) => {
    let object = req.body.bounds;
    if (object) {
        if (object.length) {
            let flag = true;
            for (const item of object) {
                if (item.name && typeof item.name === 'string') {
                    if (item.type && typeof item.type === 'number') {
                        if ((item.ub === 0 || item.ub ) && typeof item.ub === 'number') {
                            if ((item.lb || item.lb === 0 )&& typeof item.lb === 'number') {
                            } else {
                                console.log("LB wrong setting")
                                res.sendStatus(403)
                                flag = false;
                            }
                        } else {
                            console.log("Ub wrong setting")
                            res.sendStatus(403)
                            flag = false;
                        }
                    } else {
                        console.log("Type wrong setting")
                        res.sendStatus(403)
                        flag = false;
                    }
                } else {
                    console.log("Name wrong setting in bounds")
                    res.sendStatus(403)
                    flag = false;
                }
            } if (flag) {
                next();
            }
        } else {
            console.log("Buonds is empty")
            res.sendStatus(403)
        }
    } else {
        next();
    }
})

function searchVar(item, body) {
    for(const elem of body) {
        if (elem.name === item) {
            return true;
        }
    }
    return false;
}
//Controllo di binaries
app.use('/newModel', (req,res,next) => {
    let body = req.body.objective.vars;
    let object = req.body.binaries;
    if (object) {
        if (object.length) {
            let flag = true;
            for (const item of object) {
                if (typeof item === 'string') {
                    if(searchVar(item, body)){
                    } else {
                        res.sendStatus(403);
                        flag = false;
                    }
                }
            } if (flag) {
                next();
            }
        } else {
            console.log("Empy array binaries")
            res.sendStatus(403);
        }
    } else {
        next();
    }
})

const costContraint = (object) => {
    let c = object.subjectTo.length;
    if (object.bounds) {
        let co = object.bounds.length;
        return  c*0.01 + co*0.01
    } else { 
    return c*0.01
    } 
}

const checkBinOrInt = (object) => {
    let costo = 0;
    for(const item of object.objective.vars) {
        costo += valore(item.name, object)
    }
    return costo;
}

const valore = (variabile, object) => {
    if (object.binaries && object.binaries.includes(variabile)){
        return 0.1;
    } else if (object.generals && object.generals.includes(variabile)) {
        return 0.1;
    } else {
        return 0.05;
    }
}


app.use('/newModel', (req,res, next) => {
    let object = req.body;
    let costoVinc = costContraint(object);
    let costoVar = checkBinOrInt(object);
    console.log(costoVinc);
    console.log(costoVar);
    next();
})

app.use('/', require("./routes/pages"));
app.listen(PORT, HOST);
console.log("Server partito porta 8080");
