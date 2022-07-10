"use strict";
exports.__esModule = true;
exports.SingletonDB = void 0;
/**
 * The SingletonDB class defines the `getInstance` method that lets clients access
 * the unique SingletonDB instance.
 */
var sequelize_1 = require("sequelize");
require('dotenv').config({ path: __dirname + '../.env' });
var SingletonDB = /** @class */ (function () {
    function SingletonDB() {
        var db = process.env.PGDABASE;
        var username = process.env.PGUSERNAME;
        var password = process.env.PGPASSWORD;
        var host = process.env.DBHOST;
        var port = Number(process.env.PGPORT);
        var singleConnection = new sequelize_1.Sequelize(db, username, password, {
            host: host,
            port: port,
            dialect: 'postgres',
            dialectOptions: {},
            logging: false
        });
        console.log("Connessione riuscita");
    }
    SingletonDB.getInstance = function () {
        if (!SingletonDB.instance) {
            SingletonDB.instance = new SingletonDB();
        }
        return SingletonDB.instance;
    };
    SingletonDB.prototype.someBusinessLogic = function () {
    };
    return SingletonDB;
}());
exports.SingletonDB = SingletonDB;
