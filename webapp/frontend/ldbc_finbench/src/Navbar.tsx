import React from 'react';
import { Link } from "react-router-dom";

// Individual button of the bar
function NavButton({to, children}:{to: string; children:React.ReactNode}){
  return(
    // React links are employed to avoid a full page refresh when a button is clicked
    // and selected resource is changed
    <Link
        to={to}
        className="px-4 py-2 rounded-md bg-[#13294b] text-[#e0f7fa] font-medium
                 hover:bg-[#1a3561] active:bg-[#22467d]
                 transition-colors duration-200 shadow-sm"
    >
        {children}
    </Link>
  );
}

// Full navigation bar component
function Navigation_bar(){
  return(
    <nav className="w-full bg-[#0b1220] shadow-md border-b border-[#173c6b]">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
            <h1 className="text-[#e0f7fa] font-bold text-lg select-none">LDBC Finbech Project</h1>
            <div className="flex space-x-3">
                <NavButton to="/">Home</NavButton>
                <NavButton to="/analytic">Analytic Queries</NavButton>
                <NavButton to="/lookup">Lookup Queries</NavButton>
            </div>
        </div>
    </nav>
  );
}

export default Navigation_bar;