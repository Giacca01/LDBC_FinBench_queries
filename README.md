# LDBC Finbech Project

## Description
This repository contains the code developed as a final assingment
for the MMADB course, held at the University of Turin by Professor Pensa
in the academic year 2024/2025.
The aim of this project is testing two NoSQL datastores, Neo4J and MongoDB, for
modelling and querying big data.
Data are genered with the LDBC Finbench data generator.

## Setup
Before using the application, and for a full breakdown of the project, please
make sure to read the documentation PDF in the docs/ folder.
Remember to create the .env file and place credentials listes in the documentation inside it

### Prerequisites
Node.js >= 18.x
npm >= 9.x

### Backend

cd webapp/backend
npm install
nano .env (to create credentials)
npm run dev

### Frontend

cd webapp/frontend/ldbc_finbench
npm install
npm run dev