import React from "react";

// tipo degli argomenti della data table
interface DataTableArgs{
    columns: string[];
    data: any[];
    selectedRows?: number[];
    onRowToggle?: (id: number) => void;
}

function DataTable({ columns, data, selectedRows, onRowToggle }: DataTableArgs){
    return (
        <div className="w-full max-h-64 overflow-y-auto max-w-3xl bg-dark-surface rounded-lg shadow-lg">
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
    );
}

export default DataTable;