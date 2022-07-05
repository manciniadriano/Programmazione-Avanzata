"use strict";
exports.__esModule = true;
exports.ModelBuilder = void 0;
var model_1 = require("./model");
var ModelBuilder = /** @class */ (function () {
    function ModelBuilder(name, objective, subjectTo) {
        this.bounds = undefined;
        this.binaries = undefined;
        this.generals = undefined;
        this.options = undefined;
        this.name = name;
        this.objective = objective;
        this.subjectTo = subjectTo;
    }
    ModelBuilder.prototype.getName = function () {
        return this.name;
    };
    ModelBuilder.prototype.getObjective = function () {
        return this.objective;
    };
    ModelBuilder.prototype.getSubjectTo = function () {
        return this.subjectTo;
    };
    ModelBuilder.prototype.setBounds = function (bounds) {
        this.bounds = bounds;
        return this;
    };
    ModelBuilder.prototype.getBounds = function () {
        return this.bounds;
    };
    ModelBuilder.prototype.setBinaries = function (binaries) {
        this.binaries = binaries;
        return this;
    };
    ModelBuilder.prototype.getBinaries = function () {
        return this.binaries;
    };
    ModelBuilder.prototype.setGenerals = function (generals) {
        this.generals = generals;
        return this;
    };
    ModelBuilder.prototype.getGenerals = function () {
        return this.generals;
    };
    ModelBuilder.prototype.setOptions = function (options) {
        this.options = options;
        return this;
    };
    ModelBuilder.prototype.getOptions = function () {
        return this.options;
    };
    ModelBuilder.prototype.build = function () {
        return new model_1.Model(this);
    };
    return ModelBuilder;
}());
exports.ModelBuilder = ModelBuilder;
