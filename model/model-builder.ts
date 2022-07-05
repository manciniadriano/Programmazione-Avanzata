import { LP, Options } from "glpk.js";
import { Model } from "./model";

export class ModelBuilder {

    private name: string;
    private objective: LP["objective"];
    private subjectTo: LP["subjectTo"];
    private bounds?: LP["bounds"] = undefined;
    private binaries?: string[] = undefined;
    private generals?: string[] = undefined;
    private options?: Options = undefined;


    constructor(name:string, objective: LP["objective"], subjectTo:LP["subjectTo"]) {
        this.name = name;
        this.objective = objective;
        this.subjectTo = subjectTo;
    }

    public getName(): string {
        return this.name;
    }

    public getObjective(): LP["objective"] {
        return this.objective;
    }

    public getSubjectTo(): LP["subjectTo"] {
        return this.subjectTo;
    }

    public setBounds(bounds : LP["bounds"]) {
        this.bounds = bounds;
        return this;
    }    

    public getBounds() : LP["bounds"] {
        return this.bounds;
    }

    public setBinaries(binaries : string[]) {
        this.binaries = binaries;
        return this;
    }    

    public getBinaries() : string[] | undefined {
        return this.binaries;
    }

    public setGenerals(generals : string[]) {
        this.generals = generals;
        return this;
    }    

    public getGenerals(): string[] | undefined{
        return this.generals
    }

    public setOptions(options : Options) {
        this.options = options;
        return this;
    }    

    public getOptions() : Options | undefined{
        return this.options;
    }


    public build() {
        return new Model(this);
    }

}