# Script that converts the tsv files produced by the
# data generator in csv files that can be imported
# in mongodb and Neo4j
import csv
import sys

def convert_pipe_cell_csv(input_file, output_file):
    with open(input_file, 'r', encoding='utf-8-sig', newline='') as infile, \
         open(output_file, 'w', encoding='utf-8', newline='') as outfile:

        # Commas in textual fields are replaced with 
        # dedicated escape character
        writer = csv.writer(outfile)

        # Reading tsv header
        header_line = infile.readline()
        if not header_line:
            print("Input file is empty.", file=sys.stderr)
        else:
            # get header fields and write them on output file
            header = header_line.rstrip('\r\n').split('|')
            writer.writerow(header)
            expected_cols = len(header)

            # Process rows
            for lineno, line in enumerate(infile, start=2):
                line = line.rstrip('\r\n')
                if not line:
                    continue

                # gets record fields
                fields = line.split('|')
                # and writes them on output csv
                writer.writerow(fields)

            print(f"Conversion complete. Output written to: {output_file}")