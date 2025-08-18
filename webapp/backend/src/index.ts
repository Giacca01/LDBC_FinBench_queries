import express from "express";
import cors from "cors";
import createLookupRouter from "./routes/lookup.js";
import createAnalyticRouter from "./routes/analytic.js";
import neo4j, { Integer, Node, Relationship } from "neo4j-driver";
import dotenv from 'dotenv';
import mongodb from "mongodb";

const PORT = 2006;

let driver: neo4j.Driver;
let session : neo4j.Session;
let mongodbClient: mongodb.MongoClient;

async function start(){
    dotenv.config({path:"./.env"});
    const app = express()

    // enabling cors
    app.use(cors({
        origin: "http://localhost:5173"
    }));

    // json parsing
    app.use(express.json());

    driver = neo4j.driver(
        process.env.NEO_URI!,
        neo4j.auth.basic(process.env.NEO_USERNAME!, process.env.NEO_PASSWORD!),
        // loss of precision if value outside of the range [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]
        // where MAX_SAFE_INTEGER is 2^53-1 = 9,007,199,254,740,991
        { disableLosslessIntegers: true }
    );
    session = driver.session();

    mongodbClient= new mongodb.MongoClient(process.env.MONGO_CONN_STRING!);
    await mongodbClient.connect();
    const dbMongo: mongodb.Db = mongodbClient.db(process.env.MONGO_DB_NAME);

    dbMongo.collection("account")
    // muounting routers for backend resources
    app.use("/lookup", createLookupRouter(session, dbMongo))
    // stiamo dicendo che il modulo analytic servirà tutte le richieste
    // a risorse che nel path contengono /analytic
    app.use("/analytic", createAnalyticRouter(session, dbMongo));

    // starting server
    app.listen(PORT, ()=>{
        console.log("Backend started!!!");
    });
}

process.on("SIGINT", async () =>{
    session.close();
    driver.close();
    mongodbClient.close();
    console.log("DB Connection closed");
    process.exit(0);
});

start();