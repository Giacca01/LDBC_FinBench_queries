import React from "react";
import { useState } from "react";
import { ReactFlow, Background, Controls } from "@xyflow/react";
import DataTable from "./DataTable";
import "@xyflow/react/dist/style.css"

function Graph(){
    // Dati con cui comporre il grafo, ovviamente da prelevare
    // da backend
    const nodes = [
        {
            id: '1',
            position: { x: 100, y: 100 },
            data: { label: 'Customer' },
            style: { background: '#1e3a8a', color: '#fff', padding: 10, borderRadius: 8 }
        },
        {
            id: '2',
            position: { x: 300, y: 200 },
            data: { label: 'Order' },
            style: { background: '#1e3a8a', color: '#fff', padding: 10, borderRadius: 8 }
        },
        {
            id: '3',
            position: { x: 500, y: 100 },
            data: { label: 'Product' },
            style: { background: '#1e3a8a', color: '#fff', padding: 10, borderRadius: 8 }
        }
    ];

    const edges = [
        { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#38bdf8', strokeWidth: 2 } },
        { id: 'e2-3', source: '2', target: '3', animated: true, style: { stroke: '#38bdf8', strokeWidth: 2 } }
    ];

    return (
        <div className="w-full flex justify-center">
            <div style={{ width: '80%', height: '40vh', backgroundColor: 'rgb(15, 30, 65)', borderRadius: '12px' }}>
                <ReactFlow nodes={nodes} edges={edges} fitView>
                    <Background color="#0ea5e9" gap={16} />
                    <Controls />
                </ReactFlow>
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