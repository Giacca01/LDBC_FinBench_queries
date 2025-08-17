import express from "express";
import cors from "cors";
import lookup from "./routes/lookup.js"
import createAnalyticRouter from "./routes/analytic.js"
import neo4j, { Integer, Node, Relationship } from "neo4j-driver"


const PORT = 2006;
const URI = "neo4j+s://66745bf0.databases.neo4j.io";
const USERNAME = "neo4j";
const PASSWORD = "TLpvzTbUbZZ8hXCVnqVlv9d-OT7nRC1v6m_b0AdNn2o";

async function start(){
    const app = express()

    // enabling cors
    app.use(cors({
        origin: "http://localhost:5173"
    }));

    // json parsing
    app.use(express.json());

    const driver = neo4j.driver(
        URI,
        neo4j.auth.basic(USERNAME, PASSWORD),
        // loss of precision if value outside of the range [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]
        // where MAX_SAFE_INTEGER is 2^53-1 = 9,007,199,254,740,991
        { disableLosslessIntegers: true }
    );
    const session = driver.session();

    // muounting routers for backend resources
    app.use("/lookup", lookup)
    // stiamo dicendo che il modulo analytic servirà tutte le richieste
    // a risorse che nel path contengono /analytic
    app.use("/analytic", createAnalyticRouter(session))

    // starting server
    app.listen(PORT, ()=>{
        console.log("Backend started!!!");
    });
}

start();