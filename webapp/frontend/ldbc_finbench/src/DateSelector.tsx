import React, { useState } from "react";

const DateSelector: React.FC = () => {
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");

    return (
        <div className="w-full flex items-center gap-4 p-3 rounded-xl bg-blue-900/60 border border-blue-700/50">
            {/* From */}
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

            {/* To */}
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
    );
};

export default DateSelector;
