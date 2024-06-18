import csv
import json

def csv_to_json(csv_file_path, json_file_path):
    data = []

    # Read the CSV file
    with open(csv_file_path, mode='r', newline='', encoding='utf-8') as csv_file:
        csv_reader = csv.DictReader(csv_file)
        for row in csv_reader:
            data.append(row)
    
    # Write the data to a JSON file
    with open(json_file_path, mode='w', encoding='utf-8') as json_file:
        json.dump(data, json_file, indent=4)

# Specify the input and output file paths
csv_file_path = './data/UsersTable_part3.csv'
json_file_path = './data/UsersTable3.json'

# Convert CSV to JSON
csv_to_json(csv_file_path, json_file_path)
