"use strict";
exports.__esModule = true;
var model_builder_1 = require("../model/model-builder");
var ModelController = /** @class */ (function () {
    function ModelController() {
        this.takeJson = function (req, res) {
            console.log("Response code: " + res.statusCode);
            var object = req.body;
            var model = new model_builder_1.ModelBuilder(object.name, object.objective, object.subjectTo)
                .setBounds(object.bounds)
                .setBinaries(object.binaries)
                .setGenerals(object.generals)
                .setOptions(object.options)
                .build();
            console.log(model);
            res.send('helloworld');
        };
    }
    return ModelController;
}());
exports["default"] = ModelController;
