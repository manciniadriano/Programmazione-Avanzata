require('dotenv').config();
import { Sequelize} from "sequelize";
//require('dotenv').config({ path: __dirname+'../.env' });

export class SingletonDB {
    private static instance: SingletonDB;
    private singleConnection: Sequelize; 

    private constructor() { 
        const db: string = process.env.PGDATABASE as string;
        const username: string = process.env.PGUSER as string;
        const password: string = process.env.PGPASSWORD as string;
        const host: string = process.env.PGHOST as string;
        const port: number = Number(process.env.PGPORT);
        this.singleConnection = new Sequelize(db, username, password, {
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
        console.log('istanza: '+ SingletonDB.instance);

        return SingletonDB.instance;
    }

    public getConnection() {
        console.log('connessione: '+this.singleConnection);
        return this.singleConnection;        
    }

}