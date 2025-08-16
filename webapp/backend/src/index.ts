import express from "express";
import cors from "cors";
import lookup from "./routes/lookup.js"
import analytic from "./routes/analytic.js"

const PORT = 2006;
const app = express()

// enabling cors
app.use(cors({
    origin: "http://localhost:${PORT}"
}));

// json parsing
app.use(express.json());

// muounting routers for backend resources
app.use("/lookup", lookup)
app.use("/analytic", analytic)

// starting server
app.listen(PORT, ()=>{
    console.log("Backend started!!!");
});