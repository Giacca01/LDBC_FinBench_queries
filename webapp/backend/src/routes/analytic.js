import { Router } from "express";
import neo4j, { Integer, Node, Relationship } from "neo4j-driver"


function createAnalyticRouter(session, dbMongo){
    const router = Router();
    
    router.get("/investors", async (req, res)=>{
        try {
            const query = "MATCH (p:Person)-[:PersonInvest]->(:Company) RETURN DISTINCT p.id as id, p.name as name ORDER BY name"
            const result = await session.run(query, {}, { database: "Instance01" });


            //driver.close();
            let aux = [];
            for (let record of result.records){
                aux.push({"id": record.get("id"), "name": record.get("name")});
            }
            res.json(aux);

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
        
    });

    router.get("/intersection/:usrOne/usrTwo/:usrTwo", async (req, res) => {
        const usrOne = Number(req.params.usrOne);
        const usrTwo = Number(req.params.usrTwo);

        console.log("User one: " + usrOne);
        console.log("User two: " + usrTwo);

        try {
            const query = "MATCH (p1:Person)-[:PersonInvest]->(c1:Company)<-[:PersonInvest]-(p2:Person) WHERE p1.id = $usrOne AND p2.id = $usrTwo RETURN DISTINCT c1.id";
            console.log(query);
            const result = await session.run(query, {usrOne: usrOne, usrTwo: usrTwo}, { database: "Instance01" });
            console.log(result.records);
            res.json(result.records.length);
        } catch (result) {
            console.log("gay");
            console.log(result.code);
            res.status(500).json({ error: result.code });
        }
    });

    router.get("/union/:usrOne/usrTwo/:usrTwo", async (req, res) => {
        const usrOne = Number(req.params.usrOne);
        const usrTwo = Number(req.params.usrTwo);

        try {
            const query = "MATCH (p1:Person)-[:PersonInvest]->(c1:Company) WHERE p1.id = $usrOne OR p1.id = $usrTwo RETURN DISTINCT c1.id as id";
            const result = await session.run(query, {usrOne:usrOne, usrTwo:usrTwo}, {database: "Instance01"})

            let aux = [];
            for (let record of result.records) {
                console.log(record)
                aux.push(record.get("id"));
            }
            console.log("Unione: " + result.records.length);
            res.json({"companiesIds": aux, "count": result.records.length});
        } catch (result) {
            res.status(500).json({ error: result.message });
        }
    });

    router.post('/summary', async (req, res) => {
        let query = [
            { $match: { id: { $in: req.body.ids } } },
            {
                $addFields: {
                    numInvest: { $cond: [{ $isArray: "$invest" }, { $size: "$invest" }, 0] },
                    numAccounts: { $cond: [{ $isArray: "$own" }, { $size: "$own" }, 0] },
                    numLoans: { $cond: [{ $isArray: "$apply" }, { $size: "$apply" }, 0] }
                }
            },
            {
                $group: {
                    _id: "$id",
                    investors: { $first: "$numInvest"},
                    accounts: { $first: "$numAccounts"},
                    loans: { $first: "$numLoans"},
                    name: {$first: "$name"}
                }
            }
        ];

        try {
            const companies = dbMongo.collection("company");
            const summarySheets = await companies.aggregate(query).toArray();
            const summaries = dbMongo.collection("summary");

            let summariesIds = []
            for (let sheet of summarySheets)
                summariesIds.push(sheet._id)

            //await summaries.updateMany({_id: {$in: summariesIds}}, )
            
            res.json(summarySheets);
            console.log(prova);
        } catch (error) {
            console.log(error.message)
            res.status(500).json({ error: error.message });
        }
    });

    return router;
}

export default createAnalyticRouter;