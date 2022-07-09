/**
 * The SingletonDB class defines the `getInstance` method that lets clients access
 * the unique SingletonDB instance.
 */
import { Sequelize , Model, Optional} from "sequelize";
require('dotenv').config({ path: __dirname+'../.env' });

export class SingletonDB {
    private static instance: SingletonDB;
    private singleConnection: Sequelize; 

    private constructor() { 
        const db: string = process.env.PGDABASE as string;
        const username: string = process.env.PGUSERNAME as string;
        const password: string = process.env.PGPASSWORD as string;
        const host: string = process.env.DBHOST as string;
        const port: number = Number(process.env.PGPORT);
        const singleConnection = new Sequelize(db, username, password, {
            host: host,
            port: port,
            dialect: 'postgres',
            dialectOptions: {

            }, 
            logging:false});
            console.log("Connessione riuscita");
    }

    public static getInstance(): SingletonDB {
        if (!SingletonDB.instance) {
            SingletonDB.instance = new SingletonDB();
        }

        return SingletonDB.instance;
    }

    public someBusinessLogic() {
        
    }
}