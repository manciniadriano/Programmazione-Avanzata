import { LP, Options } from "glpk.js";
import { Model } from "./model";

export class ModelBuilder {

    private name: string;
    private objective: LP["objective"];
    private subjectTo: LP["subjectTo"];
    private bounds?: LP["bounds"];
    private binaries?: string[];
    private generals?: string[];
    private options?: Options;


    constructor(name:string, objective: LP["objective"], subjectTo:LP["subjectTo"]) {
        this.name = name;
        this.objective = objective;
        this.subjectTo = subjectTo;
    }

    public getName() {
        return this.name;
    }

    public getObjective() {
        return this.objective;
    }

    public getSubjectTo() {
        return this.subjectTo;
    }

    public build() {
        return new Model(this);
    }

}