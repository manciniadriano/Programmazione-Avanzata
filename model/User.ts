import { Options } from "glpk.js";
import { ModelBuilder } from "./model-builder";
import { LP } from "glpk.js";

export class User {
    email: string;
    budget: number;
    role: number;

    constructor(email: string, budget: number, role: number) {
        this.email = email;
        this.budget = budget;
        this.role = role;
    }
}