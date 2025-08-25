import csv_converter
import merger_mongo
import import_mongo
import os

# driver script for the creation of local databases copies
def create_db():
    # uri of local mongodb server
    MONGO_URI = "mongodb://localhost:27017/"

    # change to load desidered dump
    DUMP = "SF_3"
    DB_NAME = "LDB_FIN_" + DUMP

    DUMPS_DIR = 'dumps'
    CSV_DIR = 'csv'
    JSON_DIR='json'

    # loops through data dump directories
    for filedir in os.listdir(os.path.join(DUMPS_DIR, DUMP)):
        filesList = os.listdir(os.path.join(DUMPS_DIR, DUMP, filedir))

        # removes log files to avoid importing them
        for filename in filesList:
            if filename.startswith("_SUCCESS") or filename.startswith('.'):
                os.remove(os.path.join(DUMPS_DIR, DUMP, filedir, filename))
        
        # merges part files for the same class/relation
        filesList = os.listdir(os.path.join(DUMPS_DIR, DUMP, filedir))
        filesCount = len(filesList)
        if (filesCount > 1):
            for i in range(1, filesCount):
                os.system("tail -n +2 " + os.path.join(DUMPS_DIR, DUMP, filedir, filesList[i]) +" >> " + os.path.join(DUMPS_DIR, DUMP, filedir, filesList[0]))
                os.remove(os.path.join(DUMPS_DIR, DUMP, filedir, filesList[i]))
        
        # convert all file dumps from TSV to CSV
        csv_converter.convert_pipe_cell_csv(
            os.path.join(DUMPS_DIR, DUMP, filedir, filesList[0]), 
            os.path.join(CSV_DIR, filedir + ".csv")
        )       

    # convert csv to json and merge secondary documents
    merger_mongo.convert(CSV_DIR, JSON_DIR)

    # import json file to mongo
    import_mongo.import_to_mongo(JSON_DIR, MONGO_URI, DB_NAME)

if __name__ == '__main__':
    create_db()