const express = require("express");
var app = express();
const bodyParser = require("body-parser");
const { LP, Options } = require('glpk.js');
const e = require("express");
const { send } = require("server/reply");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

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
app.use('/newModel', (req, res, next) => {
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
})

app.use('/', require("./routes/pages"));
app.listen(3000, () => {
    console.log("Server stared on port 3000");
}
)