import { Router } from "express";
import neo4j, { Integer, Node, Relationship } from "neo4j-driver"


function createLookupRouter(sessionNeo, dbMongo){
    const router = Router();

    router.get("/moneyLaundary/:startWindow/endWindow/:endWindow", async (req, res) => {
        const startWindow = Number(req.params.startWindow);
        const endWindow = Number(req.params.endWindow);

        try {
            const query = `MATCH (pSrc:Person)-[:Own]->(src: Account)-[rcv:Transfer]->(mid:Account)-[snd:Transfer]->(dst:Account)<-[:Own]-(pDst:Person)
WHERE (apoc.date.convert(rcv.createTime, 'ms', 'd') > $startWindow and apoc.date.convert(rcv.createTime, 'ms', 'd') < $endWindow
and apoc.date.convert(snd.createTime, 'ms', 'd') > $startWindow and apoc.date.convert(snd.createTime, 'ms', 'd') < $endWindow)
and (src.isBlocked or mid.isBlocked or snd.isBlocked)
RETURN DISTINCT (src.id AS idSrc, src.nickname AS srcNick, mid.id AS idMid, mid.nickname AS midNick, dst.id as idDst, dst.nickname AS dstNick)`
            const result = await sessionNeo.run(query, {startWindow: startWindow, endWindow: endWindow}, { database: "Instance01" });


            //driver.close();
            let aux = [];
            for (let record of result.records) {
                aux.push(
                    {
                        "idSrc": record.get("idSrc"), 
                        "src": record.get("srcNick"), 
                        "idMid": record.get("idMid"),
                        "mid": record.get("midNick"), 
                        "idDst": record.get("idDst"),
                        "dst": record.get("dstNick")
                    }
                );
            }
            console.log(aux)
            res.json(aux);

        } catch (error) {
            res.status(500).json({ error: error });
        }
    });

    return router;
}

export default createLookupRouter;