import React, { useEffect } from "react";
import { useState } from "react";
import DataTable from "./DataTable";

type Investor = {
    id: number;
    name: string;
}

type Company = {
    companiesIds: number[];
    count: number;
}
// Componente per la formulazione del risultato
// della prima query analitica
function InvestorsList(){
    const [investors, setInvestors] = useState<Investor[]>([]);
    const [loading, setLoading] = useState(true);
    // lo stato della tabella sono le righe selezionate
    // setSelectedRows è il metodo per aggiornare lo stato
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    // altro componente dello stato: la visibilità del paragrafo con la similarità
    const [showSimilarity, setShowSimilarity] = useState(false);
    const [similarity, setSimilarity] = useState(0.0);

    useEffect(() => {
        async function fetchInvestors(){
            try {
                const response = await fetch("http://localhost:2006/analytic/investors");
                if (!response.ok)
                    throw new Error("Bad responde: " + response.status);
                const data: Investor[] = await response.json();
                setInvestors(data);
                console.log(data);
            } catch (error) {
                console.error("Error fetiching investors: ", error);
            } finally {
                setLoading(false);
            }
        }

        fetchInvestors();
    }, []);

    const toggleRow = (id: number) =>{
        setSelectedRows((prev) => {
            // deseleziono la riga già selezionata
            if (prev.includes(id)) {
                // mantengo tutte le righe attualmente selezionate
                // tranne quella cliccata
                return prev.filter((rowId) => rowId != id);
            } else if (selectedRows.length < 2) {
                // aggiunta della nuova riga all'insieme delle selezionate
                // ricordare che l'operatore ... serve ad espandere il
                // vettore esistente
                return [...selectedRows, id];
            } else
                return prev;
        });
        

        setShowSimilarity(false);
        setSimilarity(0.0);
    };

    const computeSimilarity = (async ()=> {
        try {
            console.log("Selected row: " + selectedRows[0]);
            const usrOne: number = investors[selectedRows[0]].id
            const usrTwo: number = investors[selectedRows[1]].id

            
            let response = await fetch("http://localhost:2006/analytic/intersection/" + usrOne + "/usrTwo/" + usrTwo);
            if (!response.ok)
                throw new Error("Bad responde: " + response.status);
            const intersectionLength: number = await response.json();
            console.log(intersectionLength);

            response = await fetch("http://localhost:2006/analytic/union/" + usrOne + "/usrTwo/" + usrTwo);
            if (!response.ok)
                throw new Error("Bad responde: " + response.status);
            const commonCompanies: Company = await response.json();
            console.log("Commong companies: " + commonCompanies.count);

            let jaccard: number = intersectionLength / commonCompanies.count;

            setSimilarity(jaccard);
            setShowSimilarity(true)
        } catch (error) {
            console.error("Error computing similarity: ", error);
        } finally {
            // setLoading(false);
        }
    });

    useEffect(()=>{
        async function prova(){
            try {
                const response = await fetch("http://localhost:2006/analytic/summary");
                if (!response.ok)
                    throw new Error("Bad responde: " + response.status);
            } catch (error) {
                console.error("Error test: ", error);
            }
        }

        prova();
    }, []);

    if (loading) return <p className="text-white">Loading...</p>;

    return(
        <main
            className="min-h-screen px-6 py-10"
            style={{ backgroundColor: "rgb(10, 25, 55)" }} // deep opaque blue
        >
            {/* Intro paragraph */}
            <p className="text-white text-center max-w-3xl mx-auto mb-8 leading-relaxed">
                You can select the two users from the following table.
            </p>

            {/* Table */}
            <div className="w-full flex justify-center">
                <div className="w-4/5">
                    <DataTable columns={["id", "name"]} data={investors} selectedRows={selectedRows} onRowToggle={toggleRow} />
                </div>
            </div>
            {/* Se ho selezionato due righe mostro il bottone per il calcolo */}
            {selectedRows.length === 2 && (
                <div className="flex justify-center mt-6">
                    <button
                        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-colors"
                        onClick={() => computeSimilarity()}
                    >
                        Compute Similarity
                    </button>
                </div>
            )}
            {showSimilarity && (
                <div>
                    <p className="text-white text-center max-w-3xl mx-auto mt-6 leading-relaxed">
                        The similarity value is: {similarity}
                    </p>
                </div>
            )}
        </main>
    );
}

function Analytics(){
    return(
        <main className="min-h-screen px-6 py-10" style={{ backgroundColor: "rgb(10, 25, 55)" }}>
            {/* Title */}
            <h1 className="text-white text-4xl font-bold text-center mb-4 select-none">
                Analytic Queries
            </h1>

            {/* Intro paragraph */}
            <p className="text-white text-center max-w-3xl mx-auto mb-8 leading-relaxed">
                In this page, two different analytic queries can be tested.
                The first one, formulated over the data copy stored in Neo4j, computes
                the similarity between the investment portfolios of two different users.
                The second query, formulate over the MongoDB copy, computes a resume of the two users.
            </p>
            <InvestorsList/>
        </main>
    );
}

export default Analytics;