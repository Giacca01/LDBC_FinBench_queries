import { Router } from "express";

function createLookupRouter(sessionNeo){
    const router = Router();

    // esecutes money laundering detection query
    // see documention for full explenation
    router.get("/moneyLaundary/:startWindow/endWindow/:endWindow", async (req, res) => {
        const startWindow = Number(req.params.startWindow);
        const endWindow = Number(req.params.endWindow);
        
        const query = `MATCH (pSrc:Person)-[:Own]->(src: Account)-[rcv:Transfer]->(mid:Account)-[snd:Transfer]->(dst:Account)<-[:Own]-(pDst:Person)
WHERE (src.isBlocked or dst.isBlocked or mid.isBlocked)
AND (apoc.date.convert(rcv.createTime, 'ms', 'd') > $startWindow)
AND (apoc.date.convert(rcv.createTime, 'ms', 'd') < $endWindow)
RETURN pSrc.name as srcNick, mid.nickname as midNick, pDst.name as dstNick, apoc.date.convert(rcv.createTime, 'ms', 'd') as startDate`;

        try {
            const result = await sessionNeo.run(query, 
                {startWindow: startWindow, endWindow: endWindow}, 
                { database: "Instance01" }
            );

            // extracts resulting records
            // and creates JSON
            let suspectAccounts = [];
            for (let record of result.records) {
                suspectAccounts.push(
                    {
                        "src": record.get("srcNick"), 
                        "mid": record.get("midNick"), 
                        "dst": record.get("dstNick"),
                        "startDate": record.get("startDate")
                    }
                );
            }
            res.json(suspectAccounts);

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    return router;
}

export default createLookupRouter;