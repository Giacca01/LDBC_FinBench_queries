import { Router } from "express";

function createAnalyticRouter(session, dbMongo){
    const router = Router();
    
    // executes investors list query
    // see documentation for full details
    router.get("/investors", async (req, res)=>{
        try {
            const query = "MATCH (p:Person)-[:PersonInvest]->(:Company) RETURN DISTINCT p.id as id, p.name as name ORDER BY name"
            const result = await session.run(query, {}, { database: "Instance01" });

            // extracts resulting records
            // and creates JSON
            let investors = [];
            for (let record of result.records){
                investors.push({"id": record.get("id"), "name": record.get("name")});
            }
            res.json(investors);

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
        
    });

    // executes common companies list query
    // see documentation for full details
    router.get("/intersection/:usrOne/usrTwo/:usrTwo", async (req, res) => {
        const usrOne = Number(req.params.usrOne);
        const usrTwo = Number(req.params.usrTwo);

        try {
            const query = "MATCH (p1:Person)-[:PersonInvest]->(c1:Company)<-[:PersonInvest]-(p2:Person) WHERE p1.id = $usrOne AND p2.id = $usrTwo RETURN DISTINCT c1.id";
            const result = await session.run(query, 
                {usrOne: usrOne, usrTwo: usrTwo}, 
                { database: "Instance01" }
            );
            res.json(result.records.length);
        } catch (result) {
            res.status(500).json({ error: result.code });
        }
    });

    // executes investment portfolio query
    // see documentation for full details
    router.get("/union/:usrOne/usrTwo/:usrTwo", async (req, res) => {
        const usrOne = Number(req.params.usrOne);
        const usrTwo = Number(req.params.usrTwo);

        try {
            const query = "MATCH (p1:Person)-[:PersonInvest]->(c1:Company) WHERE p1.id = $usrOne OR p1.id = $usrTwo RETURN DISTINCT c1.id as id";
            const result = await session.run(query, 
                {usrOne:usrOne, usrTwo:usrTwo}, 
                {database: "Instance01"}
            );

            let companies = [];
            for (let record of result.records) {
                companies.push(record.get("id"));
            }
            res.json({ "companiesIds": companies, "count": result.records.length});
        } catch (result) {
            res.status(500).json({ error: result.message });
        }
    });

    // executes summary sheet query
    // see documentation for full details
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
            res.json(summarySheets);
        } catch (error) {
            console.log(error.message)
            res.status(500).json({ error: error.message });
        }
    });

    return router;
}

export default createAnalyticRouter;