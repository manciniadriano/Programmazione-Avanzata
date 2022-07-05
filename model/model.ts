import { Options } from "glpk.js";
import { ModelBuilder } from "./model-builder";
import { LP } from "glpk.js";

export class Model implements LP{
    name: string;
    objective: LP["objective"];
    subjectTo: LP["subjectTo"];
    bounds?: LP["bounds"];
    binaries?: string[];
    generals?: string[];
    options?: Options;

    constructor(modelBuilder: ModelBuilder) {
        this.name = modelBuilder.getName();
        this.objective = modelBuilder.getObjective();
        this.subjectTo = modelBuilder.getSubjectTo();
        this.bounds = modelBuilder.getBounds();
        this.binaries = modelBuilder.getBinaries();
        this.generals = modelBuilder.getGenerals();
        this.options = modelBuilder.getOptions();
    }
}