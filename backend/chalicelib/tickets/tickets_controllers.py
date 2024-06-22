import boto3
from botocore.exceptions import ClientError
import uuid
from math import radians, cos, sin, asin, sqrt

dynamodb = boto3.resource("dynamodb")
tickets_table = dynamodb.Table("tickets")
users_table = dynamodb.Table("user")
assets_table = dynamodb.Table("asset")
municipality_table = dynamodb.Table("municipalities")


def generate_id():
    return str(uuid.uuid4())


def create_ticket(ticket_data):
    try:
        # Validate required fields
        required_fields = [
            "asset",
            "description",
            "latitude",
            "longitude" "user_id",
        ]
        for field in required_fields:
            if field not in ticket_data:
                error_response = {
                    "Error": {
                        "Code": "IncorrectFields",
                        "Message": f"Missing required field: {field}",
                    }
                }
                raise ClientError(error_response)

        # Ensure user exists

        # Ensure asset exists
        asset_id = ticket_data["asset"]
        asset_response = assets_table.get_item(Key={"asset_id": asset_id})
        if "Item" not in asset_response:
            error_response = {
                "Error": {
                    "Code": "ResourceNotFoundException",
                    "Message": f"Asset with ID {asset_id} does not exist",
                }
            }
            raise ClientError(error_response)

        # Generate ticket ID
        ticket_id = generate_id()
        location = {
            "latitude": ticket_data["latitude"],
            "longitude": ticket_data["longitude"],
        }
        municipality_id = findMunicipality(location)

        # Create the ticket item
        ticket_item = {
            "ticket_id": ticket_id,
            "asset": asset_id,
            "discription": ticket_data["description"],
            "user_id": ticket_data["user_id"],
            "imageURL": "https://lh3.googleusercontent.com/lWTkgY7Me1FOvsOrVdWxwn4_KbL7dNfIK6Pvtp_wkg-uIhn3ZkX1KxJhsc_2NrQn9EsrFVrnL2cgsDMnVQvl=s1028",
            "latitude": location["latitude"],
            "longitude": location["longitude"],
            "municipality_id": municipality_id,
            "state": ticket_data["state"],  # do not hard code, want to extend in future
            "upvotes": 0,
            "viewcount": 0,
        }

        # Put the ticket item into the tickets table
        tickets_table.put_item(Item=ticket_item)
        return {"message": "Ticket created successfully", "ticket_id": ticket_id}

    except ClientError as e:
        error_message = e.response["Error"]["Message"]
        return {"Status": "FAILED", "Error": error_message}


def get_fault_types():
    try:
        response = assets_table.scan()
        assets = response.get(
            "Items", []
        )  # Extracting the list of assets from the response
        # Extracting required fields from each asset
        fault_types = [
            {
                "asset_id": asset["asset_id"],
                "assetIcon": asset.get(
                    "assetIcon", ""
                ),  # Providing a default value if assetIcon is missing
                "multiplier": asset.get(
                    "multiplier", 1
                ),  # Providing a default value of 1 if multiplier is missing
            }
            for asset in assets
        ]

        return fault_types

    except ClientError as e:
        error_message = e.response["Error"]["Message"]
        return {"Status": "FAILED", "Error": error_message}


def findMunicipality(location):
    response = municipality_table.scan(
        ProjectionExpression="latitude,longitude,municipality_id"
    )
    latitude = radians(location["latitude"])
    longitude = radians(location["latitude"])
    data = response["Items"]
    closestdistance = 10000000
    municipality = ""
    if len(data) > 0:
        for x in data:
            lat2 = x["latitude"]
            long2 = x["longitude"]
            dlat = lat2 - latitude
            dlong = long2 - longitude
            a = sin(dlat / 2) ** 2 + cos(latitude) * cos(lat2) * sin(dlong / 2) ** 2
            r_earth = 6371
            distance = 2 * r_earth * asin(sqrt(a))
            if distance < closestdistance:
                closestdistance = distance
                municipality = x["municipality_id"]

        return municipality
    else:
        return "No data was produced"
