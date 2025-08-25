# Scripts that embeds secondary documents
# into primary collections before 
# creating Mongo database
import pandas as pd
import json
import os

# main is the primary collection
# secondary lists side documents
# that must be embedded in the collection 
config = [
    {
        "main": {
            "file": "person.csv",
            "id_field": "id",
            "output": "users.json"
        },
        "secondary": [
            {
                "file": "personOwnAccount.csv",
                # field used to match collection record
                # with corresponding side documents
                "foreign_key": "personId",
                # name of the field that will contain
                # the embedded document
                "embed_field": "own"
            },
            {
                "file": "personInvest.csv",
                "foreign_key": "investorId",
                "embed_field": "invest"
            },
            {
                "file": "personGuarantee.csv",
                "foreign_key": "fromId",
                "embed_field": "guarantee"
            },
            {
                "file": "personApplyLoan.csv",
                "foreign_key": "personId",
                "embed_field": "apply"
            }
        ]
    },
    {
        "main": {
            "file": "company.csv",
            "id_field": "id",
            "output": "company.json"
        },
        "secondary": [
            {
                "file": "companyOwnAccount.csv",
                "foreign_key": "companyId",
                "embed_field": "own"
            },
            {
                "file": "companyApplyLoan.csv",
                "foreign_key": "companyId",
                "embed_field": "apply"
            },
            {   
                "file": "companyGuarantee.csv",
                "foreign_key": "fromId",
                "embed_field": "guarantee"
            },
            {                
                "file": "companyInvest.csv",
                "foreign_key": "investorId",
                "embed_field": "invest"
            }
        ]
    },
    {
        "main": {
            "file": "account.csv",
            "id_field": "id",
            "output": "account.json"
        },
        "secondary": [
            {
                "file": "transfer.csv",
                "foreign_key": "fromId",
                "embed_field": "transfer"
            },
            {
                "file": "withdraw.csv",
                "foreign_key": "fromId",
                "embed_field": "withdraw"
            },
            {
                "file": "repay.csv",
                "foreign_key": "accountId",
                "embed_field": "repay"
            }
        ]
    },
    {
        "main": {
            "file": "loan.csv",
            "id_field": "id",
            "output": "loan.json"
        },
        "secondary": [
            {
                "file": "deposit.csv",
                "foreign_key": "loanId",
                "embed_field": "deposit"
            }
        ]
    },
    {
        "main": {
            "file": "medium.csv",
            "id_field": "id",
            "output": "medium.json"
        },
        "secondary": [
            {
                "file": "signIn.csv",
                "foreign_key": "mediumId",
                "embed_field": "signIn"
            }
        ]
    }
]


def process_collection(cfg, input_dir):
    main_df = pd.read_csv(os.path.join(input_dir, cfg["main"]["file"]))

    # Loading and grouping seconday documents
    relations_data = {}
    for rel in cfg["secondary"]:
        # groups secondary documents on foreign key value
        rel_df = pd.read_csv(os.path.join(input_dir, rel["file"]))
        grouped = (
            rel_df.groupby(rel["foreign_key"])
            .apply(lambda x: x.to_dict(orient="records"))
            .to_dict()
        )
        # stores the created groups
        relations_data[rel["embed_field"]] = grouped

    # Embedding the secondary documents into the main one
    main_docs = []
    for _, row in main_df.iterrows():
        doc = row.to_dict()
        doc_id = doc[cfg["main"]["id_field"]]
        for embed_field, grouped_data in relations_data.items():
            # group created before becomes value
            # of the embedded field
            doc[embed_field] = grouped_data.get(doc_id, [])
        main_docs.append(doc)

    return main_docs

def convert(input_dir, output_dir):
    # creates output directory
    os.makedirs(output_dir, exist_ok=True)

    # writes output json
    for collection_cfg in config:
        docs = process_collection(collection_cfg, input_dir)
        output_path = os.path.join(output_dir, collection_cfg["main"]["output"])
        with open(output_path, "w") as f:
            json.dump(docs, f, indent=2)
        print(f"Wrote {len(docs)} docs to {output_path}")

