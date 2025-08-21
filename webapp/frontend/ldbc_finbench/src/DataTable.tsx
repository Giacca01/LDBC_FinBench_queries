import React, { useEffect, useState } from "react";

// tipo degli argomenti della data table
interface DataTableArgs{
    columns: string[];
    data: any[];
    selectedRows?: number[];
    onRowToggle?: (id: number) => void;
}

function DataTable({ columns, data, selectedRows, onRowToggle }: DataTableArgs){
    const [searchValue, setSearchValue] = useState("");
    const [rowsToDisplay, setRowsToDisplay] = useState(data);

    useEffect(()=>{
        setRowsToDisplay(data);
    }, []);

    const searchRow = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchValue(value);

        
        if (!value) {
            // if empty search, reset to full list
            setRowsToDisplay(data);
            return;
        }

        let resultingRows = data.filter((row) => {
            // restituisco le righe in cui almeno una colonna
            // ha il valore dell'alttributo specificato dall'utente
            columns.some((col) => String(row[col]).toLowerCase().includes(searchValue.toLowerCase()));
        });

        if (resultingRows.length == 0)
            resultingRows = data;
        
        setRowsToDisplay(resultingRows);
    };

    return (
        <div className="w-full max-w-4xl bg-gray-900 text-white rounded-lg shadow-lg overflow-hidden">
            {/*Search Bar */}
            <div className="p-4 border-b border-gray-700">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchValue}
                    onChange={searchRow}
                    className="w-full p-2 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            {/*Table*/}
            <div className="w-full max-h-64 overflow-y-auto bg-dark-surface rounded-lg shadow-lg">
                <table className="min-w-full border border-gray-700 bg-slate-800 text-white">
                    <thead className="sticky top-0 bg-slate-900">
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={col}
                                    className="px-6 py-3 text-left text-sm font-semibold tracking-wider border-b border-gray-700"
                                >
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((elem, elemIndex) => {
                            const isSelected = selectedRows?.includes(elemIndex)
                            return(
                                <tr
                                    key={elemIndex}
                                    className={`transition duration-200 cursor-pointer ${isSelected ? "bg-green-700" : "hover:bg-dark-hover"}`}
                                    onClick={() => onRowToggle?.(elemIndex)}
                                >
                                    {columns.map((col) => (
                                        <td
                                            key={col}
                                            className="px-6 py-4 whitespace-nowrap border-b border-gray-700"
                                        >
                                            {elem[col]}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default DataTable;