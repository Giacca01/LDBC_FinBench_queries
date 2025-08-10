import React from "react";

// tipo degli argomenti della data table
interface DataTableArgs{
    columns: string[];
    data: string[][];
}

function DataTable({ columns, data }: DataTableArgs){
    return (
        <div className="overflow-x-auto rounded-lg shadow-lg">
            <table className="min-w-full border border-gray-700 bg-slate-800 text-white">
                <thead className="bg-slate-900">
                    <tr>
                        {columns.map((col, idx) => (
                            <th
                                key={idx}
                                className="px-6 py-3 text-left text-sm font-semibold tracking-wider border-b border-gray-700"
                            >
                                {col}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, idx) => (
                        <tr
                            key={idx}
                            className="hover:bg-slate-700 transition-colors duration-200"
                        >
                            {row.map((cell, cellIdx) => (
                                <td
                                    key={cellIdx}
                                    className="px-6 py-4 whitespace-nowrap border-b border-gray-700"
                                >
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default DataTable;