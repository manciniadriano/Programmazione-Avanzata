import { SingletonDB } from "./model/Database";
import * as express from 'express';
import * as mNM from './middleware/middleModel';
import { createSemanticDiagnosticsBuilderProgram } from "typescript";
import { send } from "process";

var app = express();


const PORT = 8080;
const HOST = '0.0.0.0';

app.use('/', require("./routes/pages"));

app.listen(PORT, HOST);
