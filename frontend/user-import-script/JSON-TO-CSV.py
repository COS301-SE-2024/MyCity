import json
import csv

def json_to_csv(json_file_path, csv_file_path):
    """
    Converts a JSON file to a CSV file.
    
    :param json_file_path: Path to the input JSON file.
    :param csv_file_path: Path to the output CSV file.
    """
    # Read the JSON data from the file
    with open(json_file_path, 'r', encoding='utf-8') as json_file:
        json_data = json.load(json_file)

    # Ensure the JSON data is a list of dictionaries
    if not isinstance(json_data, list):
        raise ValueError("JSON data should be a list of dictionaries")

    # Open the CSV file for writing
    with open(csv_file_path, mode='w', newline='', encoding='utf-8') as csv_file:
        # Create a CSV writer object
        writer = csv.DictWriter(csv_file, fieldnames=json_data[0].keys())

        # Write the header
        writer.writeheader()

        # Write the data
        for row in json_data:
            writer.writerow(row)

# Example usage
if __name__ == "__main__":
    # Path to the input JSON file
    json_file_path = './user-pool/data.json'
    
    # Path to the output CSV file
    csv_file_path = './data/UsersTable-UUIDs.csv'
    
    # Convert JSON to CSV
    json_to_csv(json_file_path, csv_file_path)

    print(f"Data has been written to {csv_file_path}")
