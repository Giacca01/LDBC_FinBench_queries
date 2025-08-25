import express from "express";
import cors from "cors";
import createLookupRouter from "./routes/lookup.js";
import createAnalyticRouter from "./routes/analytic.js";
import neo4j from "neo4j-driver";
import dotenv from 'dotenv';
import mongodb from "mongodb";

// backend server port
const PORT = 2006;

let driver: neo4j.Driver;
let session : neo4j.Session;
let mongodbClient: mongodb.MongoClient;

async function start(){
    // loading passwords and configuration
    // data from environment file
    //dotenv.config({path:"./.env"});
    const app = express()

    // enabling cors so that
    // request from frontend server are allowed
    app.use(cors({
        origin: "http://localhost:5173"
    }));

    // json parsing
    app.use(express.json());

    // connecting to Neo4j Aura Instance
    driver = neo4j.driver(
        process.env.NEO_URI!,
        neo4j.auth.basic(process.env.NEO_USERNAME!, process.env.NEO_PASSWORD!),
        // possible loss of precision: see documentation for details
        { disableLosslessIntegers: true }
    );
    session = driver.session();

    // connecting to MongoDB Atlas instance
    mongodbClient= new mongodb.MongoClient(process.env.MONGO_CONN_STRING!);
    await mongodbClient.connect();
    const dbMongo: mongodb.Db = mongodbClient.db(process.env.MONGO_DB_NAME);
    dbMongo.collection("account")

    // muounting routers for backend resources
    app.use("/lookup", createLookupRouter(session))
    app.use("/analytic", createAnalyticRouter(session, dbMongo));

    // starting server
    app.listen(PORT, ()=>{
        console.log("Backend started!!!");
    });
}

// on server termination db connections are closed
process.on("SIGINT", async () =>{
    session.close();
    driver.close();
    mongodbClient.close();
    process.exit(0);
});

start();