import * as jwt from "jsonwebtoken";
import * as sql from 'sequelize';
import { Sequelize } from "sequelize";
import { SingletonDB } from "../model/Database";
import { User } from "../model/User";

export var checkHeader = function (req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    next();
  } else {
    res.sendStatus(401);
  }
};

export function checkToken(req, res, next) {
  const bearerHeader = req.headers.authorization;
  if (typeof bearerHeader !== "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(401);
  }
}

export function verifyAndAuthenticate(req, res, next) {
  let decoded = jwt.verify(req.token, process.env.SECRET_KEY);
  if (decoded !== null) {
    req.user = decoded;
    next();
  } else {
    res.sendStatus(401);
  }
}

export function checkUser(req, res, next) {
  if (req.user.email === "user@user.com") {
    next();
  } else {
    res.sendStatus(401);
    console.log("User");
  }
}

export function checkIsUser(req, res, next) {
  if (req.user.role === "2") {
    next();
  } else {
    res.sendStatus(401);
    console.log("IsUser");
  }
}

export function checkIsAdmin(req, res, next) {
  if (req.role === "1") {
    next();
  } else {
    res.sendStatus(401);
  }
}

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

export async function checkCredito(req, res, next) {
    try {
        const connection = SingletonDB.getInstance().getConnection();
        const budget = await connection.query(`SELECT budget FROM users WHERE email == ${req.user.email}`, {
            type: sql.QueryTypes.SELECT
        });
        console.log(budget)
        next();
    } catch (e) {
        console.log('ciao errore query')
        res.sendStatus(401);
    }
    let object = req.body;
    let costoVinc = costContraint(object);
    let costoVar = checkBinOrInt(object);
    let totalCost = costoVinc + costoVar;


    
    next();
} 
