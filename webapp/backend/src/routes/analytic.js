import { Router } from "express";
import neo4j, { Integer, Node, Relationship } from "neo4j-driver"


function createAnalyticRouter(session){
    const router = Router();
    
    router.get("/investors", async (req, res)=>{
        try {
            const query = "MATCH (p:Person)-[:PersonInvest]->(:Company) RETURN p.id as id, p.name as name"
            const result = await session.run(query, {}, { database: "Instance01" });


            //driver.close();
            let aux = [];
            for (let record of result.records){
                aux.push({"id": record.get("id"), "name": record.get("name")});
            }
            res.json(aux);

            session.close();
        } catch (error) {
            res.status(500).json({ error: error });
        }
        
    });

    router.get("/intersection/:usrOne/usrTwo/:usrTwo", async (req, res) => {
        const usrOne = req.params.usrOne;
        const usrTwo = req.params.usrTwo;

        try {
            const query = "MATCH (p1:Person)-[:PersonInvest]->(c1:Company)<-[:PersonInvest]-(p2:Person) WHERE p1._id = $usrOne and p2._id = $usrTwo RETURN c1._id";
            const result = await session.run(query, {usrOne: usrOne, usrTwo: usrTwo}, { database: "Instance01" });
            res.json(result.records.length);
        } catch (error) {
            res.status(500).json({ error: error });
        }
    });

    router.get("/union/:usrOne/usrTwo/:usrTwo", async (req, res) => {
        const usrOne = req.params.usrOne;
        const usrTwo = req.params.usrTwo;

        try {
            const query = "MATCH (p1:Person)-[:PersonInvest]->(c1:Company) WHERE p1.id = $usrOne OR p1.id = $usrTwo RETURN DISTINCT c1._id";
            const result = await session.run(query, {usrOne:usrOne, usrTwo:usrTwo}, {database: "Instance01"})

            let aux = [];
            for (let record of result.records) {
                aux.push(record.get("id"));
            }
            res.json({"companiesIds": aux, "count": result.records.length});
        } catch (error) {
            res.status(500).json({ error: error });
        }
    });
}

export default createAnalyticRouter;