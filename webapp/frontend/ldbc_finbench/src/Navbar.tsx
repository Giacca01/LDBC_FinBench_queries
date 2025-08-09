import React, { useState } from 'react';
import { Link } from "react-router-dom";

// componente che modella i singoli bottoni della barra
function NavButton({to, children}:{to: string; children:React.ReactNode}){
  return(
    // uso link di react-router-dom per evitare di ricaricare tutta la pagina
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

// componente che modella il navigation bar
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