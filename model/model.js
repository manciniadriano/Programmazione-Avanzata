"use strict";
exports.__esModule = true;
exports.Model = void 0;
var Model = /** @class */ (function () {
    function Model(modelBuilder) {
        this.name = modelBuilder.getName();
        this.objective = modelBuilder.getObjective();
        this.subjectTo = modelBuilder.getSubjectTo();
        this.bounds = modelBuilder.getBounds();
        this.binaries = modelBuilder.getBinaries();
        this.generals = modelBuilder.getGenerals();
        this.options = modelBuilder.getOptions();
    }
    return Model;
}());
exports.Model = Model;
