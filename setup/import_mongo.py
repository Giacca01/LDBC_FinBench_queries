# Script that imports JSON files
# containing generated data in a Mongo db
import os
import json
from pymongo import MongoClient

# Leverages documents variable structure
# to avoid memorizing fields with no values
def clean_doc(doc):
    return {k: v for k, v in doc.items() if not (isinstance(v, list) and len(v) == 0)}

def clean_docs(docs):
    return [clean_doc(doc) for doc in docs]

def import_to_mongo(input_dir: str, uri: str, db: str):
    # creates the database if needed
    client = MongoClient(uri)
    db = client[db]

    # Imports JSON data to the database
    for file_name in os.listdir(input_dir):
        collection_name = file_name.replace(".json", "")
        db[collection_name].drop()
        file_path = os.path.join(input_dir, file_name)

        # reads json input file
        with open(file_path, "r") as f:
            docs = json.load(f)

        # if we are considering a document-valued field
        if isinstance(docs, dict):
            docs = list(docs.values())
            
        # discards empty fields
        docs = clean_docs(docs)
        if docs:
            db[collection_name].insert_many(docs)
            print(f"Inserted {len(docs)} docs into '{collection_name}' collection")
        else:
            print(f"No documents found in {file_name}")

