import React from "react";
import { useState } from "react";

// Componente per la formulazione del risultato
// della prima query analitica
function FormulateFirst(){
    // lo stato della tabella sono le righe selezionate
    // setSelectedRows è il metodo per aggiornare lo stato
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    // altro componente dello stato: la visibilità del paragrafo con la similarità
    const [showSimilarity, setShowSimilarity] = useState(false);

    // righe tra cui scegliere (andranno caricate da backend)
    const data = [
        { id: 1, name: "Alpha Query", description: "Runs the alpha analytics process." },
        { id: 2, name: "Beta Query", description: "Processes beta data for analysis." },
        { id: 3, name: "Gamma Query", description: "Handles gamma pipeline analytics." }
    ];

    // dati della tabelle con le schede riepilogative (anche queste prese da backend)
    const comparisonData = [
        { col1: "Metric A", col2: "12", col3: "15", col4: "80%" },
        { col1: "Metric B", col2: "7", col3: "7", col4: "100%" },
        { col1: "Metric C", col2: "20", col3: "25", col4: "80%" }
    ];

    const toggleRow = (id: number) =>{
        // deseleziono la riga già selezionata
        if (selectedRows.includes(id)){
            // mantengo tutte le righe attualmente selezionate
            // tranne quella cliccata
            setSelectedRows(selectedRows.filter(rowId => rowId != id));
        } else if (selectedRows.length < 2) {
            // aggiunta della nuova riga all'insieme delle selezionate
            // ricordare che l'operatore ... serve ad espandere il
            // vettore esistente
            setSelectedRows([...selectedRows, id]);
        }

        setShowSimilarity(false);
    }

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
            <div className="overflow-x-auto max-w-5xl mx-auto">
                <table className="w-full border-collapse shadow-lg rounded-lg overflow-hidden">
                    <thead>
                        <tr className="bg-gray-200 text-gray-800 text-left">
                            <th className="px-4 py-3">Select</th>
                            <th className="px-4 py-3">ID</th>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            // per ogni riga del vettore data
                            // creo la corrispondente riga della tabella
                            data.map(row => (
                                <tr
                                    key={row.id}
                                    className={`${selectedRows.includes(row.id)
                                            ? "bg-blue-600"
                                            : "bg-blue-900 hover:bg-blue-700"
                                        } text-white border-b border-blue-700 transition-colors`}
                                >
                                    <td className="px-4 py-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedRows.includes(row.id)}
                                            onChange={() => toggleRow(row.id)}
                                            className="form-checkbox h-5 w-5 text-green-400"
                                        />
                                    </td>
                                    <td className="px-4 py-3">{row.id}</td>
                                    <td className="px-4 py-3">{row.name}</td>
                                    <td className="px-4 py-3">{row.description}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
            {/* Se ho selezionato due righe mostro il bottone per il calcolo */}
            {selectedRows.length === 2 && (
                <div className="flex justify-center mt-6">
                    <button
                        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-colors"
                        onClick={() => setShowSimilarity(true)}
                    >
                        Compute Similarity
                    </button>
                </div>
            )}
            {showSimilarity && (
                <div>
                    <p className="text-white text-center max-w-3xl mx-auto mt-6 leading-relaxed">
                        The similarity value is: 0.5
                    </p>

                    {/* Results table */}
                    <div className="overflow-x-auto max-w-5xl mx-auto mt-6">
                        <table className="w-full border-collapse shadow-lg rounded-lg overflow-hidden">
                            <thead>
                                <tr className="bg-blue-800 text-white text-left">
                                    <th className="px-4 py-3">Metric</th>
                                    <th className="px-4 py-3">Value 1</th>
                                    <th className="px-4 py-3">Value 2</th>
                                    <th className="px-4 py-3">Similarity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {comparisonData.map((row, idx) => (
                                    <tr
                                        key={idx}
                                        className={`${idx % 2 === 0
                                                ? "bg-blue-900 hover:bg-blue-700"
                                                : "bg-blue-950 hover:bg-blue-700"
                                            } text-white border-b border-blue-700 transition-colors`}
                                    >
                                        <td className="px-4 py-3">{row.col1}</td>
                                        <td className="px-4 py-3">{row.col2}</td>
                                        <td className="px-4 py-3">{row.col3}</td>
                                        <td className="px-4 py-3">{row.col4}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
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
            <FormulateFirst/>
        </main>
    );
}

export default Analytics;