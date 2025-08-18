import React, { useEffect, useState } from "react";
import { GraphCanvas } from 'reagraph';
import DataTable from "./DataTable";
import "@xyflow/react/dist/style.css"

type MoneyLdr = {
    idSrc: number;
    src: string;
    idMid: number;
    mid: string;
    idDst: number;
    dst: string;
};

type Node = {
    id: string;
    label: string;
};

type Edge = {
    id: string;
    source: string;
    target: string;
    label: string;
};

function Graph(){
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);

    useEffect(()=>{
        async function fetchGraph(){
            try {
                const response = await fetch("http://localhost:2006/lookup/moneyLaundary/10000/endWindow/19331");
                if (!response.ok)
                    throw new Error("Bad responde: " + response.status);
                const responseData: MoneyLdr[] = await response.json();
                
                let nodesMap : Map<string, Node> = new Map();
                let edges : Edge[] = [];
                let i : number = 0;
                let src : string = "";
                let dst : string = "";

                for (let elem of responseData){

                    if (!nodesMap.has(elem.src)){
                        i++;
                        nodesMap.set(elem.src, {
                            id: i.toString(),
                            label: elem.src
                        });
                    }


                    if (!nodesMap.has(elem.mid)) {
                        i++;
                        nodesMap.set(elem.mid, {
                            id: i.toString(),
                            label: elem.mid
                        });
                    }

                    if (!nodesMap.has(elem.dst)) {
                        i++;
                        nodesMap.set(elem.dst, {
                            id: i.toString(),
                            label: elem.dst
                        });
                    }

                    src = nodesMap.get(elem.src)!.id;
                    dst = nodesMap.get(elem.mid)!.id;
                    edges.push({ id: src+'->'+dst, source: src, target: dst, label: src + "-" + dst });

                    src = dst
                    dst = nodesMap.get(elem.dst)!.id;
                    edges.push({ id: src + '->' + dst, source: src, target: dst, label: src + "-" + dst });
                }

                setNodes([...nodesMap.values()]);
                setEdges(edges);
            } catch (error) {
                console.error("Error fetiching graph: ", error);
            }
        }

        fetchGraph();
    }, []);

    return (
        <div className="w-full flex justify-center">
            <div style={{ width: '80%', height: '40vh', backgroundColor: 'rgb(15, 30, 65)', borderRadius: '12px' }}>
                <GraphCanvas nodes={nodes} edges={edges}></GraphCanvas>
            </div>
        </div>
    );
}

function Lookup(){
    // dati delle schede riepilogative
    const columns = ["ID", "Name", "Type", "Status"];
    const data = [
        ["1", "Alice", "Customer", "Active"],
        ["2", "Order #102", "Order", "Shipped"],
        ["3", "Product A", "Product", "In Stock"]
    ];

    return (
        <main className="min-h-screen flex flex-col items-center justify-start p-6 space-y-8" style={{ backgroundColor: "rgb(10, 25, 55)" }}>
            {/* Title */}
            <h1 className="text-white text-4xl font-bold text-center mb-4 select-none">
                Lookup Queries
            </h1>

            {/* Intro paragraph */}
            <p className="text-white text-center max-w-3xl mx-auto mb-8 leading-relaxed">
                In this page, two different lookup queries can be tested.
                The first one, formulated over the data copy stored in Neo4j, computes
                a set of accounts involved in money laundry, defined as those that have received
                and/or transferred money from/to blocked accounts.
                The second, formulated over the MongoDB copy, computes a small summary of the owners
                of such account.
            </p>
            <Graph/>
            <div className="w-full flex justify-center">
                <div className="w-4/5">
                    <DataTable columns={columns} data={data} />
                </div>
            </div>
        </main>
    );
}

export default Lookup;