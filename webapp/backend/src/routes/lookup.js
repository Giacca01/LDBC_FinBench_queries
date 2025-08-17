import { Router } from "express";
import neo4j, { Integer, Node, Relationship } from "neo4j-driver"


function createLookupRouter(session){
    const router = Router();

    router.get("/moneyLaundary/:startWindow/endWindow/:endWindow", (req, res) => {
        const startWindow = req.params.startWindow;
        const endWindow = req.params.endWindow;

        try {
            const query = `MATCH (pSrc:Person)-[:Own]->(src: Account)-[rcv:Transfer]->(mid:Account)-[snd:Transfer]->(dst:Account)<-[:Own]-(pDst:Person)
WHERE rcv.createTime > $startWindow and rcv.createTime < $endWindow
and snd.createTime > $startWindow and snd.createTime < $endWindow
and src.isBlocked or mid.isBlocked or snd.isBlocked
RETURN src.nickname AS srcNick, mid.nickname AS midNick, dst.nickname AS dstNick`
            const result = await session.run(query, {startWindow: startWindow, endWindow: endWindow}, { database: "Instance01" });


            //driver.close();
            let aux = [];
            for (let record of result.records) {
                aux.push({ "src": record.get("srcNick"), "mid": record.get("midNick"), "dst": record.get("dstNick")});
            }
            res.json(aux);

            session.close();
        } catch (error) {
            res.status(500).json({ error: error });
        }
    });
}

export default router;