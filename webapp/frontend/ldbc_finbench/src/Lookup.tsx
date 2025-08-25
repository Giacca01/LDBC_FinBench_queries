import { useEffect, useState } from "react";
import { GraphCanvas, darkTheme } from 'reagraph';
import "@xyflow/react/dist/style.css"
import Message from "./Message";

type MoneyLdr = {
    src: string;
    mid: string;
    dst: string;
    startDate: number;
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

interface GraphProps {
    nodes: Node[];
    edges: Edge[];
}

// graph visualization function
function Graph({nodes, edges}: GraphProps){
    return (
        <div className="w-full mt-80 flex justify-center" style={{ position: "absolute", width: '70%', height: '60vh', backgroundColor: 'rgb(15, 30, 65)', borderRadius: '12px' }}>
            <GraphCanvas nodes={nodes} edges={edges} theme={darkTheme} ></GraphCanvas>
        </div>
    );
}

function Lookup(){
    // nodes components
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);

    // messages variables
    const [showMessage, setShowMessage] = useState(false);
    const [messageType, setMessageType] = useState("");
    const [message, setMessage] = useState("");

    // query parameters
    const [from, setFrom] = useState("19330");
    const [to, setTo] = useState("19332");

    // when loading the page a request is sent
    // to the beckend server, to request query execution
    useEffect(() => {
        async function fetchGraph() {
            setMessageType("info");
            setMessage("Loading Investors...");
            setShowMessage(true);

            try {
                const response = await fetch("http://localhost:2006/lookup/moneyLaundary/" + from + " /endWindow/" + to);
                if (!response.ok)
                    throw new Error("Failed to fetch money laundry resource. Code: " 
                        + response.status + " Message: " 
                        + response.statusText
                    );
                const responseData: MoneyLdr[] = await response.json();

                let nodesMap: Map<string, Node> = new Map();
                let edges: Edge[] = [];
                let i: number = 0;
                let src: string = "";
                let mid: string = "";
                let dst: string = "";

                // Creates a hashmap of nodes (and related edges)
                // to avoid duplication and speed up retrieval when
                // build visualizing the graph
                for (let elem of responseData) {

                    if (!nodesMap.has(elem.src)) {
                        i++;
                        nodesMap.set(elem.src, {
                            id: i.toString(),
                            label: "User: " + elem.src
                        });
                    }


                    if (!nodesMap.has(elem.mid)) {
                        i++;
                        nodesMap.set(elem.mid, {
                            id: i.toString(),
                            label: "Account: " + elem.mid
                        });
                    }

                    if (!nodesMap.has(elem.dst)) {
                        i++;
                        nodesMap.set(elem.dst, {
                            id: i.toString(),
                            label: "User: " + elem.dst
                        });
                    }

                    src = nodesMap.get(elem.src)!.id;
                    mid = nodesMap.get(elem.mid)!.id;
                    dst = nodesMap.get(elem.dst)!.id;
                    edges.push({ 
                        id: src + '->' + mid + ":" + elem.startDate, 
                        source: src, 
                        target: mid, 
                        label: "Transaction: " + src + "-" + mid + " date " + elem.startDate 
                    });

                    edges.push({ 
                        id: mid + '->' + dst + ":" + elem.startDate, 
                        source: mid, 
                        target: dst, 
                        label: "Transaction: " + mid + "-" + dst + " date " + elem.startDate 
                    });
                }

                setNodes([...nodesMap.values()]);
                setEdges(edges);
                setShowMessage(false);
            } catch (error) {
                setMessageType("error");
                setMessage("An error occurred while loading suspect transactions. Error message: " + error);
                setShowMessage(true);
            }
        }

        fetchGraph();
    }, []);

    return (
        <main className="min-h-screen flex flex-col items-center justify-start p-6 space-y-8" style={{ backgroundColor: "rgb(10, 25, 55)" }}>
            <h1 className="text-white text-4xl font-bold text-center mb-4 select-none">
                Lookup Queries
            </h1>

            <p className="text-white text-center max-w-3xl mx-auto mb-8 leading-relaxed">
                In this page, a single lookup query, formulated on the Neo4j copy of the data, can be tested.
                The query returns a graph of triplets user1-account-user2, representing suspect money laundry operations.
                A money laundry operation is defined as a transaction of money from user1 to user2, involving the intermediate
                account, that started in a certain time window.
                For the transaction to be suspect, at least one of the involved account (either that of user1 or user2, or
                the middle one) must be blocked.
                Note that begin and end dates must be specified in days from Unix Time.
            </p>

            {/*Simple text fields for dates range specification*/}
            <div className="flex items-center gap-4 p-3 rounded-xl bg-blue-900/60 border border-blue-700/50">
                <label className="flex items-center gap-2 text-white/90">
                    <span className="text-sm">From (days)</span>
                    <input
                        type="number"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        className="px-2 py-1 w-28 rounded bg-blue-950 text-white placeholder-white/40
                     border border-blue-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                </label>

                <label className="flex items-center gap-2 text-white/90">
                    <span className="text-sm">To (days)</span>
                    <input
                        type="number"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        className="px-2 py-1 w-28 rounded bg-blue-950 text-white placeholder-white/40
                     border border-blue-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                </label>
            </div>
            <Graph nodes={nodes} edges={edges}/>
            {
                showMessage && (
                    <div className="flex justify-center items-center">
                        <Message msgType={messageType} msgText={message} />
                    </div>
                )
            }
        </main>
    );
}

export default Lookup;