import { Model } from "../model/model";
import { ModelBuilder } from "../model/model-builder";
import { GLPK } from "glpk.js";
class ModelController {


public takeJson = (req, res) => {
    console.log("Response code: " + res.statusCode);
    
    const object = req.body;
    const model: Model = new ModelBuilder(object.name, object.objective, object.subjectTo)
                                        .setBounds(object.bounds)
                                        .setBinaries(object.binaries)
                                        .setGenerals(object.generals)
                                        .setOptions(object.options)
                                        .build();
    console.log(model);
    res.send('helloworld');
}
}

export default ModelController;