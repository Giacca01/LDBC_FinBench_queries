import { useEffect } from "react";
import { useState } from "react";
import DataTable from "./DataTable";
import Message from "./Message";

type Investor = {
    id: number;
    name: string;
}

type Company = {
    companiesIds: number[];
    count: number;
}

type Summary = {
    name: string;
    investors: number;
    accounts: number;
    loans: number;
}

function InvestorsList(){
    // investors list
    const [investors, setInvestors] = useState<Investor[]>([]);
    // People selected for similarity computation
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    // decides whether or not to display similarity
    const [showSimilarity, setShowSimilarity] = useState(false);
    const [similarity, setSimilarity] = useState(0.0);
    // decides whether or not to display summary sheets
    const [summary, setSummary] = useState<Summary[]>([]);
    const [showMessage, setShowMessage] = useState(false);

    const [messageType, setMessageType] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        async function fetchInvestors(){
            setMessageType("info");
            setMessage("Loading Investors...");
            setShowMessage(true);

            try {
                // gets investors list from server
                const response = await fetch("http://localhost:2006/analytic/investors");
                if (!response.ok)
                    throw new Error(
                        "Failed to fetch investors resource. Code: " 
                        + response.status 
                        + " Message: " 
                        + response.statusText
                    );

                const data: Investor[] = await response.json();
                setShowMessage(false);
                setInvestors(data);
            } catch (error) {
                setMessageType("error");
                setMessage("An error occurred while loading investors. Error message: " + error);
                setShowMessage(true);
            }
        }

        fetchInvestors();
    }, []);

    // handles row selection change
    const toggleRow = (id: number) =>{
        setSelectedRows((prev) => {
            // already selected row is de-selected
            if (prev.includes(id)) {
                // all other selected rows are kept
                return prev.filter((rowId) => rowId != id);
            } else if (selectedRows.length < 2) {
                // newly selected row is added to the list
                return [...selectedRows, id];
            } else
                return prev;
        });
        
        // Selection reset: similarity and summary 
        // must be hidden and reset
        setShowMessage(false);
        setShowSimilarity(false);
        setSimilarity(0.0);
        setSummary([]);
    };

    // requests data to server to compute similarity
    const computeSimilarity = (async ()=> {
        try {
            const usrOne: number = investors[selectedRows[0]].id
            const usrTwo: number = investors[selectedRows[1]].id

            // gets common companies from the server
            let response = await fetch("http://localhost:2006/analytic/intersection/" 
                + usrOne + "/usrTwo/" + usrTwo
            );
            if (!response.ok)
                throw new Error("Failed to fetch intersection resource. Code: " 
                    + response.status + " Message: " 
                    + response.statusText
                );  
            const intersectionLength: number = await response.json();

            // gets investment porfolios from server
            response = await fetch("http://localhost:2006/analytic/union/" 
                + usrOne + "/usrTwo/" + usrTwo
            );
            if (!response.ok)
                throw new Error("Failed to fetch union resource. Code: " 
                    + response.status + " Message: " 
                    + response.statusText
                );
            const commonCompanies: Company = await response.json();

            let jaccard: number = intersectionLength / commonCompanies.count;

            setSimilarity(jaccard);
            computeSummary(commonCompanies.companiesIds);
            setShowSimilarity(true);
            setShowMessage(false);
        } catch (error) {
            setMessageType("error");
            setMessage("An error occurred while computing simlarity. Error message: " + error);
            setShowMessage(true);
        }
    });

    const computeSummary = (async (companies: Number[])=>{
        try {
            // gets summary sheets from server
            // POST request is used because a list of companies ids must be sent
            const response = await fetch("http://localhost:2006/analytic/summary", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ids: companies})
            });
            if (!response.ok)
                throw new Error(
                    "Failed to fetch summary resource. Code: " 
                    + response.status 
                    + " Message: " + response.statusText
                );

            const summarySheets: Summary[] = await response.json();
            setSummary(summarySheets);
            setShowMessage(false);
        } catch (error) {
            setMessageType("error");
            setMessage("An error occurred while preparing compny summary report. Error message: " + error);
            setShowMessage(true);
        }
    });

    return(
        <main className="min-h-screen px-6 py-10" style={{ backgroundColor: "rgb(10, 25, 55)" }}>
            <p className="text-white text-lg text-center max-w-3xl mx-auto mb-8 leading-relaxed">
                You can select the two users from the following table.
            </p>

            <div className="flex justify-center items-center">
                <DataTable columns={["id", "name"]} data={investors} selectedRows={selectedRows} onRowToggle={toggleRow} />
            </div>
            {/* Similairty computation button is shown only if selection has been made */}
            {
                selectedRows.length === 2 && (
                    <div className="flex justify-center mt-6">
                        <button
                            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-colors"
                            onClick={() => computeSimilarity()}
                        >
                            Compute Similarity
                        </button>
                    </div>
                )
            }
            {
                showSimilarity && (
                    <div>
                        <p className="text-white text-center text-lg max-w-3xl mx-auto mt-6 leading-relaxed">
                            The similarity value is: {similarity.toFixed(4)}
                        </p>
                        <p className="text-white text-lg text-center max-w-3xl mx-auto mb-8 leading-relaxed">
                            Summary of the companies the users invest in
                        </p>
                        <div className="flex justify-center items-center">
                            <DataTable columns={["name", "investors", "accounts", "loans"]} data={summary}/>
                        </div>
                    </div>
                )
            }
            {
                showMessage && (
                    <div className="flex justify-center items-center">
                        <Message msgType={messageType} msgText={message}/>
                    </div>
                )
            }
        </main>
    );
}

function Analytics(){
    return(
        <main className="min-h-screen px-6 py-10" style={{ backgroundColor: "rgb(10, 25, 55)" }}>
            <h1 className="text-white text-4xl font-bold text-center mb-4 select-none">
                Analytic Queries
            </h1>

            <p className="text-white text-lg text-center max-w-3xl mx-auto mb-8 leading-relaxed">
                In this page, two different analytic queries can be tested.
                The first one, formulated over the data copy stored in Neo4j, computes
                the similarity between the investment portfolios of two different users.
                The second query, formulate over the MongoDB copy, computes a resume of the compenies
                the users invest in.
                Each row of the summary features, for a different company, the number of investors (companies
                that invest in the current one), the number of accounts owned, and the number of loans taken out.
            </p>
            <InvestorsList/>
        </main>
    );
}

export default Analytics;