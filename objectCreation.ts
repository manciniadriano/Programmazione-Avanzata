import { Model } from "./model";
import { ModelBuilder } from "./model-builder";

const GLPK = require('glpk.js');
const glpk = GLPK();


let a = { direction: glpk.GLP_MAX, name: 'obj', vars: [{ name: 'x1', coef: 0.6 },{ name: 'x2', coef: 0.5 }]}
let b = [
    {
        name: 'cons1',
        vars: [
            { name: 'x1', coef: 1.0 },
            { name: 'x2', coef: 2.0 }
        ],
        bnds: { type: glpk.GLP_UP, ub: 1.0, lb: 0.0 }
    },
    {
        name: 'cons2',
        vars: [
            { name: 'x1', coef: 3.0 },
            { name: 'x2', coef: 1.0 }
        ],
        bnds: { type: glpk.GLP_UP, ub: 2.0, lb: 0.0 }
    }
];
let model = new ModelBuilder("M1", a, b).build();

