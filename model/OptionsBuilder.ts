import { Options } from "./Options";
const GLPK = require("glpk.js");
const glpk = GLPK()

/*cb: {               //a callback called at each 'each' iteration (only simplex) 
        call(result: Result),
        each: number
    }*/

export class OptionsBuilder{

    private mipgap: number= 0.0;    /* set relative mip gap tolerance to mipgap, default 0.0 */
    private tmlim?: number=Number.MAX_VALUE;     /* limit solution time to tmlim seconds, default INT_MAX */
    private msglev?: number= glpk.GLP_MSG_ERR;    /* message level for terminal output, default GLP_MSG_ERR */
    private presol?: boolean=true;   /* use presolver, default true */
    private cb?: any={
        call: (progress) => console.log(progress),
        each: 1,
      };

      setmipgap(mipgap:number){
        if(mipgap){
        this.mipgap=mipgap;
        return this;
      }
      else return this;

      }

      settmlim(tmlim:number){
        if(tmlim){
        this.tmlim=tmlim;
        return this;
        }
        else return this;
         
      }
      setmsglev(msglev:number){
        if(msglev){
        this.msglev=msglev;
        return this;
        }
        else return this;
      }
      setpresol(presol:boolean){
        if(presol){
        this.presol=presol;
        return this;
        }
        else return this;
      }
      setcb(cb:Object){
        if(cb){
        this.cb=cb;
        return this;
        }
        else return this;
      }

      build() {
        return new Options(this);
    }

    isHavingmipgap(){
        return this.mipgap;
    }

    isHavingtmlim(){
        return this.tmlim;
    }

    isHavingmsglev(){
        return this.msglev;
    }
    isHavingpresol(){
        return this.presol;
    }
    isHavingcb(){
        return this.cb;
    }
}